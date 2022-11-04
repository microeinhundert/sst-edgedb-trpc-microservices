import type { ZodFormattedError } from "zod";
import { z } from "zod";

/**
 * Specify your apps environment variables schema here.
 */
export const schema = z.object({
  NODE_ENV: z.string(),
  API_URL: z.string(),
  REGION: z.string(),
  DOMAIN_NAME: z.string(),
  SESSION_SECRET: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
  COGNITO_USER_POOL_CLIENT_ID: z.string(),
  COGNITO_BASE_URL: z.string(),
});

function formatErrors(errors: ZodFormattedError<Map<string, string>, string>) {
  return Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value) {
        return `${name}: ${value._errors.join(", ")}\n`;
      }
      return false;
    })
    .filter(Boolean);
}

const schemaParseResult = schema.safeParse(process.env);

if (!schemaParseResult.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(schemaParseResult.error.format())
  );

  throw new Error("Invalid environment variables");
}

const env = schemaParseResult.data;

export function getEnvVar(key: keyof typeof env) {
  const value = env[key];

  if (typeof value === "undefined") {
    throw new Error(`Missing environment variable "${key}"`);
  }

  return value;
}

/**
 * Specify environment variables which should be accessible globally here.
 */
export const globalEnv = {
  NODE_ENV: env.NODE_ENV,
  API_URL: env.API_URL,
  REGION: env.REGION,
  DOMAIN_NAME: env.DOMAIN_NAME,
};

declare global {
  interface Window {
    env: typeof globalEnv;
  }

  // eslint-disable-next-line no-var
  var env: typeof globalEnv;
}

global.env = globalEnv;
