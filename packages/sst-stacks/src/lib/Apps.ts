import type { StackContext } from "@serverless-stack/resources";
import { RemixSite, use } from "@serverless-stack/resources";
import crypto from "crypto";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { env } from "./env";

export function AppsStack({ stack }: StackContext) {
  const { apiUrl } = use(ApiStack);
  const { cognitoParameters } = use(AuthStack);

  /*
   * Site
   */

  const site = new RemixSite(stack, "Site", {
    path: "apps/site",
    environment: {
      API_URL: apiUrl,
      REGION: stack.region,
      DOMAIN_NAME: env.SITE_DOMAIN_NAME,
      SESSION_SECRET: crypto.randomBytes(20).toString("hex"),
      COGNITO_USER_POOL_ID: cognitoParameters.COGNITO_USER_POOL_ID.value,
      COGNITO_USER_POOL_CLIENT_ID: cognitoParameters.COGNITO_USER_POOL_CLIENT_ID.value,
      COGNITO_BASE_URL: cognitoParameters.COGNITO_BASE_URL.value,
    },
    customDomain: {
      domainName: env.SITE_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

  const siteUrl = site.customDomainUrl ?? site.url;

  stack.addOutputs({
    SiteUrl: siteUrl,
  });
}
