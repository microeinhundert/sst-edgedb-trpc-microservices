export function getGlobalEnvVar(key: keyof typeof env) {
  const value = env[key];

  if (typeof value === "undefined") {
    throw new Error(`Missing global environment variable "${key}"`);
  }

  return value;
}

export const isProduction = getGlobalEnvVar("NODE_ENV") === "production";
