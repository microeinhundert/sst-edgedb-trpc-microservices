import { createCookie, redirect } from "@remix-run/node";
import { z } from "zod";

import { env } from "../env";
import { isProduction } from "../utils/env";

const cookieSettings = {
  maxAge: 60 * 60 * 30,
  secure: isProduction,
  secrets: [env.SESSION_SECRET],
  httpOnly: true,
};

const accessTokenCookie = createCookie("accessToken", cookieSettings);
const idTokenCookie = createCookie("idToken", cookieSettings);
const refreshTokenCookie = createCookie("refreshToken", cookieSettings);

const credentialsResponseSchema = z.object({
  access_token: z.string().min(1),
  id_token: z.string().min(1),
  refresh_token: z.string().min(1),
});
const userResponseSchema = z.object({
  given_name: z.string().min(1),
  family_name: z.string().min(1),
});

type Credentials = z.infer<typeof credentialsResponseSchema>;
type User = z.infer<typeof userResponseSchema>;

type ContextSetter<TContextValue> = (newContext: TContextValue | null) => TContextValue | null;

/**
 * Helper funtion for the authentication flow sequence.
 *
 * @template TContextValue
 * @param {(Record<string, (setter: ContextSetter<TContextValue>) => Promise<void> | void>)} steps
 * @return {(Promise<TContextValue | null>)}
 */
async function authenticationFlow<TContextValue>(
  steps: Record<string, (setter: ContextSetter<TContextValue>) => Promise<void> | void>
): Promise<TContextValue | null> {
  let context: TContextValue | null = null;

  for (const [stepIdentifier, step] of Object.entries(steps)) {
    const contextSetter: ContextSetter<TContextValue> = (newContext) => {
      return (context = newContext);
    };

    try {
      await step.apply(context, [contextSetter]);
      if (context) {
        break;
      }
    } catch {
      throw new Error(`An error occurred in the authentication flow at step "${stepIdentifier}"`);
    }
  }

  return context;
}

/**
 * Appends the credentials as individual `Set-Cookie` headers.
 *
 * @param {Headers} headers
 * @param {Credentials} credentials
 */
async function appendCredentialsAsCookieHeaders(headers: Headers, credentials: Credentials) {
  headers.append(
    "Set-Cookie",
    await accessTokenCookie.serialize({
      access_token: credentials.access_token,
    })
  );

  headers.append(
    "Set-Cookie",
    await idTokenCookie.serialize({
      id_token: credentials.id_token,
    })
  );

  headers.append(
    "Set-Cookie",
    await refreshTokenCookie.serialize({
      refresh_token: credentials.refresh_token,
    })
  );
}

/**
 * Gets the access token cookie value.
 *
 * @param {Request} request
 * @return {Promise<string | null>}
 */
async function getAccessTokenCookieValue(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const parsedAccessTokenCookie = await (accessTokenCookie.parse(cookieHeader) || {});
  if (!parsedAccessTokenCookie?.access_token) {
    return null;
  }

  return String(parsedAccessTokenCookie.access_token);
}

/**
 * Gets the refresh token cookie value.
 *
 * @param {Request} request
 * @return {Promise<string | null>}
 */
async function getRefreshTokenCookieValue(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const parsedRefreshTokenCookie = await (refreshTokenCookie.parse(cookieHeader) || {});
  if (!parsedRefreshTokenCookie?.refresh_token) {
    return null;
  }

  return String(parsedRefreshTokenCookie.refresh_token);
}

/**
 * Gets the credentials.
 *
 * @param {string} code
 * @param {string} redirectUri
 * @return {Promise<Credentials | null>}
 */
async function getCredentials(code: string, redirectUri: string) {
  const response = await fetch(`${env.AUTH_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.AUTH_USER_POOL_CLIENT_ID,
      redirect_uri: redirectUri,
      code,
    }),
  });

  if (!response.ok) {
    return null;
  }

  try {
    return credentialsResponseSchema.parse(await response.json());
  } catch {
    throw new Error("The response returned by Cognito does not adhere to the expected schema");
  }
}

/**
 * Exchanges the old credentials for new ones.
 *
 * @param {Request} request
 * @param {string} redirectUri
 * @return {Promise<Credentials | null>}
 */
async function refreshCredentials(request: Request, redirectUri: string) {
  const refreshToken = await getRefreshTokenCookieValue(request);
  if (!refreshToken) {
    return null;
  }

  const response = await fetch(`${env.AUTH_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: env.AUTH_USER_POOL_CLIENT_ID,
      redirect_uri: redirectUri,
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    return null;
  }

  try {
    return credentialsResponseSchema.parse(await response.json());
  } catch {
    throw new Error("The response returned by Cognito does not adhere to the expected schema");
  }
}

/**
 * Gets the user info.
 * If this call succeeds, the user is authenticated.
 *
 * @param {string} accessToken
 * @return {Promise<any>}
 */
async function getUserInfo(accessToken: string) {
  const response = await fetch(`${env.AUTH_BASE_URL}/oauth2/userInfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  try {
    return userResponseSchema.parse(await response.json());
  } catch {
    throw new Error("The response returned by Cognito does not adhere to the expected schema");
  }
}

/**
 * Authenticates the user.
 *
 * @param {Request} request
 * @return {Promise<TypedResponse<never>>}
 */
export async function authenticate(request: Request) {
  const url = new URL(request.url);
  const redirectUri = url.origin + url.pathname;
  const redirectTo = encodeURIComponent(url.searchParams.get("redirectTo") || "/");

  const headers = new Headers();

  const user = await authenticationFlow<User>({
    checkCode: async (setUser) => {
      const code = url.searchParams.get("code");

      // If the url has a code, we redirected the user to cognito and they were authenticated
      if (code) {
        const credentials = await getCredentials(code, redirectUri);
        if (credentials) {
          setUser(await getUserInfo(credentials.access_token));
          appendCredentialsAsCookieHeaders(headers, credentials);
        }
      }
    },
    checkAccessToken: async (setUser) => {
      const accessToken = await getAccessTokenCookieValue(request);
      if (accessToken) {
        setUser(await getUserInfo(accessToken));
      }
    },
    refreshCredentials: async (setUser) => {
      const credentials = await refreshCredentials(request, redirectUri);
      if (credentials) {
        const user = setUser(await getUserInfo(credentials.access_token));
        if (user) {
          appendCredentialsAsCookieHeaders(headers, credentials);
        }
      }
    },
  });

  // We have no user, redirect to cognito login page
  if (!user) {
    const redirectSearchParams = new URLSearchParams({
      client_id: env.AUTH_USER_POOL_CLIENT_ID,
      response_type: "code",
      scope: "email",
      redirect_uri: redirectUri,
      state: redirectTo,
    });

    return redirect(`${env.AUTH_BASE_URL}/login?${redirectSearchParams}`);
  }

  // We have a user
  const state = url.searchParams.get("state");
  const finalRedirectUrl = decodeURIComponent(state || redirectTo);

  return redirect(finalRedirectUrl, { headers });
}
