import type { ApiAuthorizer, ApiRouteProps, Duration } from "@serverless-stack/resources";
import type { IFunction } from "aws-cdk-lib/aws-lambda";

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
  let allowOrigins = [env.ADMIN_DOMAIN_NAME, env.SITE_DOMAIN_NAME].map(
    (domainName) => `https://${domainName}`
  );

  if (isDevStage) {
    // 5173 = Vite App
    // 3000 = Remix App
    allowOrigins = [...allowOrigins, [5173, 3000].map((port) => `http://127.0.0.1:${port}`)].flat();
  }

  return {
    maxAge: "1 day",
    allowCredentials: true,
    allowOrigins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["*"],
  } as CorsConfig;
}

export function generateRoutesForTRPCService(
  serviceName: string,
  serviceFunction: IFunction,
  options?: { public?: boolean }
) {
  type Routes = Record<string, ApiRouteProps<keyof Record<string, ApiAuthorizer>>>;

  return ["GET", "POST"].reduce((routes, routeMethod) => {
    return {
      ...routes,
      [`${routeMethod} /${serviceName}/{path+}`]: {
        function: serviceFunction,
        authorizer: options?.public ? "none" : "iam",
      },
    };
  }, {}) as Routes;
}
