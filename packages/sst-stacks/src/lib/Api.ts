import type { StackContext } from "@serverless-stack/resources";
import { Api, use } from "@serverless-stack/resources";

import { AuthStack } from "./Auth";
import { env } from "./env";
import { getCorsConfig } from "./utils/api";

export function ApiStack({ stack }: StackContext) {
  const { auth } = use(AuthStack);

  const api = new Api(stack, "Api", {
    cors: getCorsConfig(stack.stage === "dev"),
    customDomain: {
      domainName: env.API_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
      path: "v1",
    },
    authorizers: {
      jwt: {
        type: "user_pool",
        userPool: {
          id: auth.userPoolId,
          clientIds: [auth.userPoolClientId],
        },
      },
    },
    defaults: {
      authorizer: "jwt",
    },
  });

  auth.attachPermissionsForAuthUsers(stack, [api]);

  const apiUrl = api.customDomainUrl ?? api.url;

  stack.addOutputs({
    ApiEndpoint: apiUrl,
  });

  return { api, apiUrl };
}
