import type { StackContext } from "@serverless-stack/resources";
import { RemixSite, use, ViteStaticSite } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { env } from "./env";
import { generateRandomString } from "./utils/crypto";

export function AppsStack({ stack }: StackContext) {
  const { apiUrl } = use(ApiStack);
  const { cognitoParameters } = use(AuthStack);

  /*
   * Portal
   */

  const portal = new ViteStaticSite(stack, "Portal", {
    path: "apps/portal",
    environment: {
      VITE_API_URL: apiUrl,
      VITE_REGION: stack.region,
      VITE_DOMAIN_NAME: env.PORTAL_DOMAIN_NAME,
      VITE_SESSION_SECRET: generateRandomString(),
      ...Object.entries(cognitoParameters).reduce(
        (acc, [key, parameter]) => ({ ...acc, [`VITE_${key}`]: parameter.value }),
        {}
      ),
    },
    customDomain: {
      domainName: env.PORTAL_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

  const portalUrl = portal.customDomainUrl ?? portal.url;

  /*
   * Site
   */

  const site = new RemixSite(stack, "Site", {
    path: "apps/site",
    environment: {
      API_URL: apiUrl,
      REGION: stack.region,
      DOMAIN_NAME: env.SITE_DOMAIN_NAME,
      SESSION_SECRET: generateRandomString(),
      ...Object.entries(cognitoParameters).reduce(
        (acc, [key, parameter]) => ({ ...acc, [key]: parameter.value }),
        {}
      ),
    },
    customDomain: {
      domainName: env.SITE_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

  const siteUrl = site.customDomainUrl ?? site.url;

  stack.addOutputs({
    PortalUrl: portalUrl,
    SiteUrl: siteUrl,
  });
}
