/* eslint-disable @typescript-eslint/no-explicit-any */
import { createCookie } from "@remix-run/node";
import { assign, createMachine } from "xstate";

import { env } from "~/env";
import { isProduction } from "~/utils/env";

const cookieOptions = {
  maxAge: 60 * 60 * 30,
  secure: isProduction,
  secrets: [env.SESSION_SECRET],
  httpOnly: true,
};

const accessTokenCookie = createCookie("accessToken", cookieOptions);
const refreshTokenCookie = createCookie("refreshToken", cookieOptions);
const idTokenCookie = createCookie("idToken", cookieOptions);

export const authenticationMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEECuAXAFmAduglgMYCGBA9jgHT474HEA2AxAMIASAoiwNKKgAOZWHXwU+IAB6IAzADZZlAAyLpATgBMAdgAc6gKwAWVbM2yANCACeiAwYUHNm4wEZVjp670BfLxbRZcAhJyKhh0AhwoABUyAGtcJggKMGocADc4lLCY+JxxQWEQ8SkEVVtKA0VtbVlnPT1pRXV1cytEPWcFMuqOvW1pdTltHz8MbDwiUlFQsHCaaMycJjAAJxWyFcp+BlIAMw2AW0psxfyhETEkSUQygwqqmrqGppaLawRZaT0KyoGHRQ6tVUIxA-nGQSmFEohGwhFi8xyCSSOBSNAy8WhsNiiLyVwKF1xoBKcgUyjUWl0hmMpjeMl0lFUfUqzmUmn0AOkILBgUmIUxYDhCMWyzWGy2O3Q+xWRxhAuxpzx5yKV2J8iUKg0On0RhMrXeg2cDJ0qkaBmkWoaBi5Yx5wWmlBWYF2jtgmCFuUSyVS6JSjudcEwOLOhWmxRu5Uq1Vq9UazT1iBa0gq8n6qmcmmcBnUJutAQmdqhfpdbsiOJF6022z2hwdTuLQcVIcuRPDd0jjxjL3jCHUdQq-QzVLcNWGvlBNvzkJmc0iAFVYKsAJI4faelHezLHWbzpcrsjBglhhCZ2pKbSuXS9hxObS0hAk5MDRQGerOLTm3Pg3n2sIRKA7lZl1XVYK3FatpS3dAAKA-dG0PFVEBPQ0qgvZpM0cVRbzaBBegZAxtDKJo3GcaROTHblJz5BcZygABlOBhAoNdUXSTdqPo2BGMJEB8WVFtj0ZO4yhaaNdEZLD3kZBkNF7EitFUTCqk-W0p0oai-w4rjyzFKtJRrdiGNDOC+OuATDDwkS6jEvo72kelxKzTDyRTHwxxwMgIDgcQKIhPkaBERgDxMkotDuUxnwGPQyj0RRNAMO89C0PDM2qNQjEURllMon9Zj-BsBCVIz+NkSoGSvWRFFkapNGkToEqaH4FNkdRtDNWLnFHUY818+1ZUFUsFQKptuJKLM717TR+2UAxOjceRnyynrCzrAN3VwIKitMirtEodQzRigEGl0WrxuUBlWtauKoueTLyInJbpz-aC9w25tTOcTNDWawYvlZW5bI6BkSpa2Q3FUDK9qtO7uu-KF1PmTTNt4zaSk6IwLKquLtDiupNFsr5k3B2pQZZBTpChrqvwLKhiHu2GcAAMWIfAGEgV6RoTE9KD0UwapawcFLx7C5ENYwVDanRPkcRb6coWmYep2jUEIQgwEgNnjJRzm7G53mBmxupBbvAjzv6ZRmqzfo9pl6n2aPDq7w61yvCAA */
  createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./authenticationMachine.typegen").Typegen0,
      schema: {
        context: {} as {
          request: any;
          user: any;
          accessToken: any;
          refreshToken: any;
          idToken: any;
          headers: Headers;
          error: any;
        },
      },
      context: {
        request: null,
        user: null,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        headers: new Headers(),
        error: null,
      },
      id: "Authentication",
      initial: "initial",
      states: {
        initial: {
          on: {
            CHECK: [
              {
                cond: "hasCode",
                target: "gettingToken",
              },
              {
                cond: "hasSession",
                target: "checkingToken",
              },
              {
                target: "authenticationFailed",
              },
            ],
          },
        },
        gettingToken: {
          invoke: {
            src: "getToken",
            id: "getToken",
            onDone: {
              target: "gettingUserInfo",
            },
            onError: {
              target: "authenticationFailed",
            },
          },
        },
        checkingToken: {
          invoke: {
            src: "checkToken",
            id: "checkToken",
            onDone: {
              target: "gettingUserInfo",
            },
            onError: {
              target: "refreshingToken",
            },
          },
        },
        refreshingToken: {
          invoke: {
            src: "refreshToken",
            id: "refreshToken",
            onDone: {
              target: "gettingUserInfo",
            },
            onError: {
              target: "authenticationFailed",
            },
          },
        },
        gettingUserInfo: {
          invoke: {
            src: "getUserInfo",
            id: "getUserInfo",
            onDone: {
              target: "settingSession",
            },
            onError: {
              target: "authenticationFailed",
            },
          },
        },
        settingSession: {
          invoke: {
            src: "setSession",
            id: "setSession",
            onDone: {
              target: "authenticationSucceeded",
            },
            onError: {
              target: "authenticationFailed",
            },
          },
        },
        authenticationFailed: {
          entry: "doRedirect",
          type: "final",
        },
        authenticationSucceeded: {
          type: "final",
        },
      },
    },
    {
      services: {
        getToken: async (context, event) => {
          const url = new URL(context.request.url);
          const redirectUri = url.origin + url.pathname;

          const body = {
            grant_type: "authorization_code",
            client_id: env.AUTH_USER_POOL_CLIENT_ID,
            redirect_uri: redirectUri,
            code,
          };

          return fetch(`${env.AUTH_BASE_URL}/oauth2/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(body),
          });
        },
        checkToken: async (context, event) => {
          console.log("checkToken");
        },
        refreshToken: async (context, event) => {
          const cookieHeaders = context.request.headers.get("Cookie");

          console.log("refreshToken");
        },
        getUserInfo: async (context, event) => {
          const response = await fetch(`${env.AUTH_BASE_URL}/oauth2/userInfo`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${context.accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error("An error occured while fetching user info from cognito");
          }

          const user = await response.json();

          assign({ user });

          return user;
        },
        setSession: async (context, event) => {
          context.headers.append(
            "Set-cookie",
            await accessTokenCookie.serialize({
              access_token: context.accessToken,
            })
          );

          context.headers.append(
            "Set-cookie",
            await refreshTokenCookie.serialize({
              refresh_token: context.refreshToken,
            })
          );

          context.headers.append(
            "Set-cookie",
            await idTokenCookie.serialize({
              id_token: context.idToken,
            })
          );
        },
      },
      actions: {
        doRedirect: (context, event) => {
          console.log("doRedirect");
        },
      },
      guards: {
        hasCode: (context, event) => {
          return true;
        },
        hasSession: (context, event) => {
          return true;
        },
      },
    }
  );
