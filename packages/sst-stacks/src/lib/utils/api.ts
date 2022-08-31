import type { ApiRouteProps, Duration } from "@serverless-stack/resources";
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
  let allowOrigins = [env.PORTAL_DOMAIN_NAME, env.SITE_DOMAIN_NAME].map(
    (domainName) => `https://${domainName}`
  );

  if (isDevStage) {
    // 3000 = Site App
    const allowDevOrigins = [3000].map((port) => `http://localhost:${port}`);
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

export function generateRoutesForTRPCService(
  serviceName: string,
  serviceFunction: IFunction,
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
