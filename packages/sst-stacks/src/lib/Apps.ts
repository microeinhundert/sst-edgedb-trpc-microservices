import type { StackContext } from "@serverless-stack/resources";
import { RemixSite, use, ViteStaticSite } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { env } from "./env";

export function AppsStack({ stack }: StackContext) {
  const { apiUrl } = use(ApiStack);

  /*
   * Admin
   */

  const admin = new ViteStaticSite(stack, "Admin", {
    path: "apps/admin",
    environment: {
      VITE_API_URL: apiUrl,
    },
    customDomain: {
      domainName: env.ADMIN_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

  const adminUrl = admin.customDomainUrl ?? admin.url;

  /*
   * Site
   */

  const site = new RemixSite(stack, "Site", {
    path: "apps/site",
    environment: {
      API_URL: apiUrl,
    },
    customDomain: {
      domainName: env.SITE_DOMAIN_NAME,
      hostedZone: env.ROUTE53_ZONE_NAME,
    },
  });

  const siteUrl = site.customDomainUrl ?? site.url;

  stack.addOutputs({
    AdminUrl: adminUrl,
    SiteUrl: siteUrl,
  });

  return { admin, adminUrl, site, siteUrl };
}
