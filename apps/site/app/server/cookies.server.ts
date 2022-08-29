import { createCookie } from "@remix-run/node";

import { env } from "~/env";
import { isProduction } from "~/utils/env";

export const accessTokenCookie = createCookie("access_token", {
  domain: isProduction ? env.DOMAIN_NAME : undefined,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  secrets: [env.SESSION_SECRET],
  httpOnly: true,
});

export const refreshTokenCookie = createCookie("refresh_token", {
  domain: isProduction ? env.DOMAIN_NAME : undefined,
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 Days
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  secrets: [env.SESSION_SECRET],
  httpOnly: true,
});
