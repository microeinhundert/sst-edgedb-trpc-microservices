import type { Stack, StackContext } from "@serverless-stack/resources";
import { RemixSite, use } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { env } from "./env";
import { generateRandomString } from "./utils/crypto";
import { prefixObjectKeys } from "./utils/general";

function getSiteEnvironment(
  { domainName, prefix }: { domainName: string; prefix?: string },
  stack: Stack
) {
  const { apiUrl } = use(ApiStack);
  const { cognitoParameters } = use(AuthStack);

  const cognitoEnvironment = Object.entries(cognitoParameters).reduce(
    (environment, [key, parameter]) => ({ ...environment, [key]: parameter.value }),
    {}
  );

  const environment = {
    API_URL: apiUrl,
    REGION: stack.region,
    DOMAIN_NAME: domainName,
    SESSION_SECRET: generateRandomString(),
    ...cognitoEnvironment,
  };

  return prefix ? prefixObjectKeys(environment, prefix) : environment;
}

export function AppsStack({ stack }: StackContext) {
  /*
   * Site
   */

  const site = new RemixSite(stack, "Site", {
    path: "apps/site",
    environment: getSiteEnvironment({ domainName: env.SITE_DOMAIN_NAME }, stack),
    customDomain: {
      domainName: env.SITE_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

  stack.addOutputs({
    SiteUrl: site.customDomainUrl ?? site.url,
  });
}
