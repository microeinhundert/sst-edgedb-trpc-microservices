import type { StackContext } from "@serverless-stack/resources";
import { use, ViteStaticSite } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { env } from "./env";

export function AppsStack({ stack }: StackContext) {
  const { apiUrl } = use(ApiStack);
  const { auth } = use(AuthStack);

  /*
   * Site
   */

  const site = new ViteStaticSite(stack, "Site", {
    path: "apps/site",
    environment: {
      VITE_API_URL: apiUrl,
      VITE_REGION: stack.region,
      VITE_USER_POOL_ID: auth.userPoolId,
      VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_DOMAIN_NAME: env.ROUTE53_ZONE_NAME,
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

  return { site, siteUrl };
}
