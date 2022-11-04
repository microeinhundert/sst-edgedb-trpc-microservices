import { createCookie } from "@remix-run/node";

import { getEnvVar } from "~/server/env.server";
import { isProduction } from "~/utils/env";

export const accessTokenCookie = createCookie("access_token", {
  domain: isProduction ? getEnvVar("DOMAIN_NAME") : undefined,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  secrets: [getEnvVar("SESSION_SECRET")],
  httpOnly: true,
});

export const refreshTokenCookie = createCookie("refresh_token", {
  domain: isProduction ? getEnvVar("DOMAIN_NAME") : undefined,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  secrets: [getEnvVar("SESSION_SECRET")],
  httpOnly: true,
});
