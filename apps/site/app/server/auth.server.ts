import { redirect } from "@remix-run/node";
import { z } from "zod";

import { credentialsCookie } from "~/cookies.server";
import { env } from "~/env";

/**
 * Schema
 */
const credentialsSchema = z.object({
  access_token: z.string().min(1),
  id_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_in: z.number(),
  expires_at: z.number().optional(),
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
type User = z.infer<typeof userSchema>;

type MaybePromise<T> = Promise<T> | T;

type ContextSetter<TInitialContextValue, TContextValue> = (
  newContext: TInitialContextValue | TContextValue
) => TInitialContextValue | TContextValue;

/**
 * Helper function to create a authentication flow sequence.
 *
 * @template TContextValue
 * @template TInitialContextValue
 * @param {(Record<string, (setter: ContextSetter<TInitialContextValue, TContextValue>) => MaybePromise<void>)} stages
 * @param {TInitialContextValue} initialContext
 * @return {(AsyncGenerator<
 *   TInitialContextValue | TContextValue,
 *   void,
 *   void
 * >)}
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
 * Appends the credentials cookie.
 *
 * @param {Headers} headers
 * @param {Credentials} credentials
 * @return {Promise<Headers>}
 */
async function appendCredentialsCookie(headers: Headers, credentials: Credentials) {
  const newHeaders = new Headers(headers);

  newHeaders.append(
    "Set-Cookie",
    await credentialsCookie.serialize({
      ...credentials,
      expirest_at: Date.now() + credentials.expires_in,
    })
  );

  return newHeaders;
}

/**
 * Gets the credentials cookie.
 *
 * @param {Request} request
 * @return {Promise<Credentials | null>}
 */
async function getCredentialsCookie(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }

  const cookie = await credentialsCookie.parse(cookieHeader);
  if (!cookie) {
    return null;
  }

  const parsedCookie = credentialsSchema.safeParse(cookie);
  if (!parsedCookie.success) {
    throw new Error("Error parsing the credentials cookie");
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

  if (response.status !== 200) {
    return null;
  }

  const parsedResponse = credentialsSchema.safeParse(await response.json());
  if (!parsedResponse.success) {
    throw new Error(
      "The response returned by Cognito does not adhere to the schema expected by `getCredentials`"
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

  if (response.status !== 200) {
    return null;
  }

  const parsedResponse = credentialsSchema.safeParse(await response.json());
  if (!parsedResponse.success) {
    throw new Error(
      "The response returned by Cognito does not adhere to the schema expected by `refreshCredentials`"
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
  const response = await fetch(`${env.AUTH_BASE_URL}/oauth2/userInfo`, {
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
      "The response returned by Cognito does not adhere to the schema expected by `getUserInfo`"
    );
  }

  return parsedResponse.data;
}

/**
 * Authenticates the user.
 *
 * @param {Request} request
 * @return {Promise<TypedResponse<never>>}
 */
export async function authenticate(request: Request) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}${url.pathname}`;
  const redirectTo = encodeURIComponent(url.searchParams.get("redirectTo") || "/");

  let headers = new Headers();

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

        headers = await appendCredentialsCookie(headers, credentials);
      },
      checkAccessToken: async (setUser) => {
        const credentials = await getCredentialsCookie(request);
        if (!credentials?.access_token) {
          return;
        }

        // Return if the credentials expired
        if ((credentials?.expires_at ?? 0) <= Date.now()) {
          return;
        }

        setUser(await getUserInfo(credentials.access_token));
      },
      refreshCredentials: async (setUser) => {
        const credentials = await getCredentialsCookie(request);
        if (!credentials?.refresh_token) {
          return;
        }

        const refreshedCredentials = await refreshCredentials(
          credentials.refresh_token,
          redirectUri
        );
        if (!refreshedCredentials) {
          return;
        }

        const user = setUser(await getUserInfo(refreshedCredentials.access_token));
        if (!user) {
          return;
        }

        headers = await appendCredentialsCookie(headers, refreshedCredentials);
      },
    },
    null
  );

  let authenticatedUser: User | null = null;

  for await (const authenticationFlowContext of authenticationFlow) {
    if (authenticationFlowContext) {
      authenticatedUser = authenticationFlowContext;
      break;
    }
  }

  // We have no user, redirect to cognito login page
  if (!authenticatedUser) {
    const redirectSearchParams = new URLSearchParams({
      client_id: env.AUTH_USER_POOL_CLIENT_ID,
      response_type: "code",
      redirect_uri: redirectUri,
      state: redirectTo,
    });

    return redirect(`${env.AUTH_BASE_URL}/login?scope=email+openid&${redirectSearchParams}`);
  }

  // We have a user
  const state = url.searchParams.get("state");
  const finalRedirectUrl = decodeURIComponent(state || redirectTo);

  return redirect(finalRedirectUrl, { headers });
}
