import { redirect } from "@remix-run/node";
import { IssueCredentialsOutput, UserInfoOutput } from "@sst-app/auth/validators";
import { createAuthenticationFlow } from "@sst-app/auth-utils";
import type { MaybePromise } from "@sst-app/types";
import { z } from "zod";

import { accessTokenCookie, refreshTokenCookie } from "~/server/cookies.server";
import { getEnvVar } from "~/server/env.server";
import { trpcClient } from "~/utils/trpc";

import { commitSession, destroySession, getSession } from "./session.server";

/**
 * Schemas
 */
const accessTokenSchema = z.object({
  value: z.string().min(1),
  expires_at: z.number(),
});

const refreshTokenSchema = z.object({
  value: z.string().min(1),
  expires_at: z.number(),
});

/**
 * Types
 */
type AccessToken = z.infer<typeof accessTokenSchema>;
type RefreshToken = z.infer<typeof refreshTokenSchema>;

type Credentials = IssueCredentialsOutput;
type User = UserInfoOutput;

/**
 * Checks if a token has expired.
 */
function isTokenExpired(token: { expires_at: number }) {
  return token.expires_at <= Date.now() / 1000;
}

/**
 * Appends the access and refresh token cookies.
 */
async function appendCredentialCookies(headers: Headers, credentials: Credentials) {
  const newHeaders = new Headers(headers);

  newHeaders.append(
    "Set-Cookie",
    await accessTokenCookie.serialize({
      value: credentials.access_token,
      expires_at: Math.floor(Date.now() / 1000 + credentials.expires_in),
    } as AccessToken)
  );

  newHeaders.append(
    "Set-Cookie",
    await refreshTokenCookie.serialize({
      value: credentials.refresh_token ?? "",
      expires_at: Math.floor(Date.now() / 1000 + 60 * 60 * 24 * 30), // 30 Days
    } as RefreshToken)
  );

  return newHeaders;
}

/**
 * Clears the access and refresh token cookies as well as the session.
 */
async function clearSessionCookies(headers: Headers) {
  const newHeaders = new Headers(headers);
  const session = await getSession(headers.get("Cookie"));

  newHeaders.append("Set-Cookie", await accessTokenCookie.serialize(""));
  newHeaders.append("Set-Cookie", await refreshTokenCookie.serialize(""));
  newHeaders.append("Set-Cookie", await destroySession(session));

  return newHeaders;
}

/**
 * Gets the access token cookie value.
 */
async function getAccessTokenCookieValue(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookie = await accessTokenCookie.parse(cookieHeader);
  if (!cookie) {
    return null;
  }

  const parsedCookie = accessTokenSchema.safeParse(cookie);
  if (!parsedCookie.success) {
    throw new Error("Error parsing the access token cookie");
  }

  return parsedCookie.data;
}

/**
 * Gets the refresh token cookie value.
 */
async function getRefreshTokenCookieValue(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookie = await refreshTokenCookie.parse(cookieHeader);
  if (!cookie) {
    return null;
  }

  const parsedCookie = refreshTokenSchema.safeParse(cookie);
  if (!parsedCookie.success) {
    throw new Error("Error parsing the refresh token cookie");
  }

  return parsedCookie.data;
}

type AuthenticateCallbacks = { onUser?: (user: User, headers: Headers) => MaybePromise<void> };

/**
 * Authenticates the user.
 */
export async function authenticateUser(request: Request, callbacks?: AuthenticateCallbacks) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/callback/`;

  let headers = new Headers(request.headers);

  const authenticationFlow = createAuthenticationFlow<User>(
    {
      checkCode: async (setUser) => {
        // If the url has a code, we redirected the user
        // to cognito and they were authenticated
        const code = url.searchParams.get("code");
        if (!code) {
          return;
        }

        const credentials = await trpcClient.auth.credentials.issue.mutate({
          code,
          redirectUri,
        });

        const user = setUser(
          await trpcClient.auth.userInfo.query({
            accessToken: credentials.access_token,
          })
        );
        if (!user) {
          return;
        }

        headers = await appendCredentialCookies(headers, credentials);
      },
      checkAccessToken: async (setUser) => {
        const accessToken = await getAccessTokenCookieValue(request);
        if (!accessToken) {
          return;
        }

        if (isTokenExpired(accessToken)) {
          console.log("The access token expired");
          return;
        }

        setUser(
          await trpcClient.auth.userInfo.query({
            accessToken: accessToken.value,
          })
        );
      },
      refreshCredentials: async (setUser) => {
        const refreshToken = await getRefreshTokenCookieValue(request);
        if (!refreshToken) {
          return;
        }

        if (isTokenExpired(refreshToken)) {
          console.log("The refresh token expired");
          return;
        }

        const refreshedCredentials = await trpcClient.auth.credentials.refresh.mutate({
          refreshToken: refreshToken.value,
          redirectUri,
        });

        const user = setUser(
          await trpcClient.auth.userInfo.query({
            accessToken: refreshedCredentials.access_token,
          })
        );
        if (!user) {
          return;
        }

        headers = await appendCredentialCookies(headers, refreshedCredentials);
      },
    },
    null,
    {
      onError: async (error) => {
        console.log(error);
        headers = await clearSessionCookies(headers);
      },
    }
  );

  let user: User | null = null;

  // Let's try getting the user
  for await (const authenticationFlowContext of authenticationFlow) {
    if (authenticationFlowContext) {
      await callbacks?.onUser?.(authenticationFlowContext, headers);
      user = authenticationFlowContext;
      break;
    }
  }

  // We have a user
  if (user) {
    const state = url.searchParams.get("state");

    if (state) {
      throw redirect(decodeURIComponent(state), { headers });
    }

    throw redirect(request.url, { headers });
  }

  // We have no user
  const redirectSearchParams = new URLSearchParams({
    client_id: getEnvVar("COGNITO_USER_POOL_CLIENT_ID"),
    response_type: "code",
    redirect_uri: redirectUri,
    state: request.url,
  });

  throw redirect(
    `${getEnvVar("COGNITO_BASE_URL")}/login?scope=email+openid&${redirectSearchParams}`
  );
}

/**
 * Ensures the user is authenticated.
 */
export async function ensureUserAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionKey = "authenticated_user";

  const userFromSession = session.get(sessionKey);
  if (userFromSession) {
    return JSON.parse(userFromSession) as User;
  }

  await authenticateUser(request, {
    onUser: async (user, headers) => {
      // Set the user session
      session.set(sessionKey, JSON.stringify(user));
      headers.append("Set-Cookie", await commitSession(session));
    },
  });

  return null;
}

/**
 * Logs the user out.
 */
export async function logoutUser(request: Request) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/auth/callback/`;

  const redirectSearchParams = new URLSearchParams({
    client_id: getEnvVar("COGNITO_USER_POOL_CLIENT_ID"),
    response_type: "code",
    redirect_uri: redirectUri,
  });

  throw redirect(
    `${getEnvVar("COGNITO_BASE_URL")}/logout?scope=email+openid&${redirectSearchParams}`,
    {
      headers: await clearSessionCookies(request.headers),
    }
  );
}
