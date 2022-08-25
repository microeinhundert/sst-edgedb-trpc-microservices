import type { StackContext } from "@serverless-stack/resources";
import { use, ViteStaticSite } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { env } from "./env";

export function AppsStack({ stack }: StackContext) {
  const { apiUrl } = use(ApiStack);

  /*
   * Site
   */

  const site = new ViteStaticSite(stack, "Admin", {
    path: "apps/site",
    environment: {
      VITE_API_URL: apiUrl,
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
