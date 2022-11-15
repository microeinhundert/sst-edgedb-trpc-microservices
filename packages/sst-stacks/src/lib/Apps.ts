import type { Stack, StackContext } from "@serverless-stack/resources";
import { RemixSite, StaticSite, use } from "@serverless-stack/resources";

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
   * Portal
   */

  const portal = new StaticSite(stack, "Portal", {
    path: "apps/portal",
    buildCommand: "npm run build",
    buildOutput: "dist",
    environment: getSiteEnvironment({ domainName: env.PORTAL_DOMAIN_NAME, prefix: "VITE" }, stack),
    vite: {
      types: "sst-env.d.ts",
    },
    customDomain: {
      domainName: env.PORTAL_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

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
    PortalUrl: portal.customDomainUrl ?? portal.url,
    SiteUrl: site.customDomainUrl ?? site.url,
  });
}
