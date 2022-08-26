import type { StackContext } from "@serverless-stack/resources";
import { RemixSite, use, ViteStaticSite } from "@serverless-stack/resources";

import { ApiStack } from "./Api";
import { AuthStack } from "./Auth";
import { env } from "./env";

export function AppsStack({ stack }: StackContext) {
  const { apiUrl } = use(ApiStack);
  const { auth } = use(AuthStack);

  /*
   * Admin
   */

  const admin = new ViteStaticSite(stack, "Admin", {
    path: "apps/admin",
    environment: {
      VITE_API_URL: apiUrl,
      VITE_REGION: stack.region,
      VITE_USER_POOL_ID: auth.userPoolId,
      VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      VITE_DOMAIN_NAME: env.ADMIN_DOMAIN_NAME,
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
      REGION: stack.region,
      USER_POOL_ID: auth.userPoolId,
      USER_POOL_CLIENT_ID: auth.userPoolClientId,
      DOMAIN_NAME: env.SITE_DOMAIN_NAME,
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
