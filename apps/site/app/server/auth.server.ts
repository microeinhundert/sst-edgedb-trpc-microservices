import { redirect } from "@remix-run/node";
import { z } from "zod";

import { accessTokenCookie, refreshTokenCookie } from "~/server/cookies.server";
import { getEnvVar } from "~/server/env.server";

import { commitSession, destroySession, getSession } from "./session.server";

/**
 * Schema
 */
const credentialsSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().optional(),
  id_token: z.string().min(1),
  expires_in: z.number(),
});
const accessTokenSchema = z.object({
  value: z.string().min(1),
  expires_at: z.number(),
});
const refreshTokenSchema = z.object({
  value: z.string().min(1),
  expires_at: z.number(),
});
const userSchema = z.object({
  sub: z.string().min(1),
  email: z.string().email(),
  username: z.string().min(1),
});

/**
 * Types
 */
type Credentials = z.infer<typeof credentialsSchema>;
type AccessToken = z.infer<typeof accessTokenSchema>;
type RefreshToken = z.infer<typeof refreshTokenSchema>;
type User = z.infer<typeof userSchema>;
type MaybePromise<T> = Promise<T> | T;
type ContextSetter<TInitialContextValue, TContextValue> = (
  newContext: TInitialContextValue | TContextValue
) => TInitialContextValue | TContextValue;

/**
 * Checks if a token has expired.
 *
 * @param {{ expires_at: number }} token
 * @return {boolean}
 */
function isTokenExpired(token: { expires_at: number }) {
  return token.expires_at <= Date.now() / 1000;
}

/**
 * Creates a authentication flow sequence.
 *
 * @template TContextValue
 * @template TInitialContextValue
 * @param {(Record<string, (setter: ContextSetter<TInitialContextValue, TContextValue>) => MaybePromise<void>)} stages
 * @param {TInitialContextValue} initialContext
 * @return {(AsyncGenerator<TInitialContextValue | TContextValue, void, void>)}
 */
async function* createAuthenticationFlow<TContextValue, TInitialContextValue = null>(
  stages: Record<
    string,
    (setter: ContextSetter<TInitialContextValue, TContextValue>) => MaybePromise<void>
  >,
  initialContext: TInitialContextValue
): AsyncGenerator<TInitialContextValue | TContextValue, void, void> {
  let context: TInitialContextValue | TContextValue = initialContext;

  const contextSetter: ContextSetter<TInitialContextValue, TContextValue> = (newContext) => {
    return (context = newContext);
  };

  for (const [stageIdentifier, stage] of Object.entries(stages)) {
    console.log(`Authentication flow at stage "${stageIdentifier}"`);

    try {
      await stage.apply({ set: contextSetter }, [contextSetter]);
      yield context;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `An error occurred in the authentication flow at stage "${stageIdentifier}": ${error.message}`
        );
      }
      throw new Error(
        `An unknown error occurred in the authentication flow at stage "${stageIdentifier}"`
      );
    }
  }
}

/**
 * Appends the access and refresh token cookies.
 *
 * @param {Headers} headers
 * @param {Credentials} credentials
 * @return {Promise<Headers>}
 */
async function appendCookies(headers: Headers, credentials: Credentials) {
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
 * Gets the access token cookie value.
 *
 * @param {Request} request
 * @return {Promise<AccessToken | null>}
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
 *
 * @param {Request} request
 * @return {Promise<RefreshToken | null>}
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

/**
 * Gets the credentials.
 *
 * @param {string} code
 * @param {string} redirectUri
 * @return {Promise<Credentials | null>}
 */
async function getCredentials(code: string, redirectUri: string) {
  const response = await fetch(`${getEnvVar("COGNITO_BASE_URL")}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: getEnvVar("COGNITO_USER_POOL_CLIENT_ID"),
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedResponse = credentialsSchema.safeParse(await response.json());
  if (!parsedResponse.success) {
    throw new Error(
      "The response returned by Cognito does not match the schema expected by `getCredentials`"
    );
  }

  return parsedResponse.data;
}

/**
 * Exchanges the old credentials for new ones.
 *
 * @param {string} refreshToken
 * @param {string} redirectUri
 * @return {Promise<Credentials | null>}
 */
async function refreshCredentials(refreshToken: string, redirectUri: string) {
  const response = await fetch(`${getEnvVar("COGNITO_BASE_URL")}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: getEnvVar("COGNITO_USER_POOL_CLIENT_ID"),
      redirect_uri: redirectUri,
      refresh_token: refreshToken,
    }),
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedResponse = credentialsSchema.safeParse(await response.json());
  if (!parsedResponse.success) {
    throw new Error(
      "The response returned by Cognito does not match the schema expected by `refreshCredentials`"
    );
  }

  return parsedResponse.data;
}

/**
 * Gets the user info.
 * If this call succeeds, the user is authenticated.
 *
 * @param {string} accessToken
 * @return {Promise<User | null>}
 */
async function getUserInfo(accessToken: string) {
  const response = await fetch(`${getEnvVar("COGNITO_BASE_URL")}/oauth2/userInfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status !== 200) {
    return null;
  }

  const parsedResponse = userSchema.safeParse(await response.json());
  if (!parsedResponse.success) {
    throw new Error(
      "The response returned by Cognito does not match the schema expected by `getUserInfo`"
    );
  }

  return parsedResponse.data;
}

type AuthenticateCallbacks = { onUser?: (user: User, headers: Headers) => MaybePromise<void> };

/**
 * Authenticates the user.
 *
 * @param {Request} request
 * @param {AuthenticateCallbacks} [callbacks]
 * @return {Promise<User>}
 */
export async function authenticate(request: Request, callbacks?: AuthenticateCallbacks) {
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

        const credentials = await getCredentials(code, redirectUri);
        if (!credentials) {
          return;
        }

        const user = setUser(await getUserInfo(credentials.access_token));
        if (!user) {
          return;
        }

        headers = await appendCookies(headers, credentials);
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

        setUser(await getUserInfo(accessToken.value));
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

        const refreshedCredentials = await refreshCredentials(refreshToken.value, redirectUri);
        if (!refreshedCredentials) {
          return;
        }

        const user = setUser(await getUserInfo(refreshedCredentials.access_token));
        if (!user) {
          return;
        }

        headers = await appendCookies(headers, refreshedCredentials);
      },
    },
    null
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
 *
 * @export
 * @param {Request} request
 * @return {Promise<User | null>}
 */
export async function ensureAuthenticated(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionKey = "authenticated_user";

  const userFromSession = session.get(sessionKey);
  if (userFromSession) {
    return JSON.parse(userFromSession) as User;
  }

  await authenticate(request, {
    onUser: async (user, headers) => {
      // Set the user session
      session.set(sessionKey, JSON.stringify(user));
      headers.append("Set-Cookie", await commitSession(session));
    },
  });

  return null;
}

/**
 * Unauthenticates the user.
 *
 * @param {Request} request
 * @param {string} [redirectTo]
 * @return {Promise<void>}
 */
export async function unauthenticate(request: Request, redirectTo?: string) {
  const headers = new Headers(request.headers);
  const session = await getSession(headers.get("Cookie"));

  headers.append("Set-Cookie", await accessTokenCookie.serialize(""));
  headers.append("Set-Cookie", await refreshTokenCookie.serialize(""));
  headers.append("Set-Cookie", await destroySession(session));

  throw redirect(redirectTo ?? "/", { headers });
}
