import type { ApiRouteProps, Duration, FunctionDefinition } from "@serverless-stack/resources";

import { env } from "../env";

type Method = "DELETE" | "GET" | "HEAD" | "OPTIONS" | "PATCH" | "POST" | "PUT";

interface CorsConfig {
  maxAge: Duration;
  allowCredentials: boolean;
  allowOrigins: string[];
  allowMethods: Method[];
  allowHeaders: string[];
}

export function getCorsConfig(isDevStage?: boolean) {
  let allowOrigins = [env.SITE_DOMAIN_NAME].map((domainName) => `https://${domainName}`);

  if (isDevStage) {
    // 3000 = Site App
    const allowDevOrigins = [3001, 3000].map((port) => `http://127.0.0.1:${port}`);
    allowOrigins = [...allowOrigins, allowDevOrigins].flat();
  }

  return {
    maxAge: "1 day",
    allowCredentials: true,
    allowOrigins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["*"],
  } as CorsConfig;
}

export function generateServiceRoutes(
  serviceName: string,
  serviceFunction: FunctionDefinition,
  options?: { public?: boolean }
) {
  type Routes = Record<string, ApiRouteProps<"jwt">>;

  return ["GET", "POST"].reduce((routes, routeMethod) => {
    return {
      ...routes,
      [`${routeMethod} /${serviceName}/{path+}`]: {
        function: serviceFunction,
        authorizer: options?.public ? "none" : "jwt",
      },
    } as Routes;
  }, {});
}
