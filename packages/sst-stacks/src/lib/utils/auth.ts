import { env } from "../env";

export function getAuthCallbackUrls(isDevStage?: boolean) {
  let callbackUrls = [env.PORTAL_DOMAIN_NAME, env.SITE_DOMAIN_NAME].map(
    (domainName) => `https://${domainName}/auth/callback/`
  );

  if (isDevStage) {
    // 3001 = Portal App
    // 3000 = Site App
    const devCallbackUrls = [3001, 3000].map((port) => `http://localhost:${port}/auth/callback/`);
    callbackUrls = [...callbackUrls, devCallbackUrls].flat();
  }

  return callbackUrls;
}

export function getAuthLogoutUrls(isDevStage?: boolean) {
  let logoutUrls = [env.PORTAL_DOMAIN_NAME, env.SITE_DOMAIN_NAME].map(
    (domainName) => `https://${domainName}/auth/logout/`
  );

  if (isDevStage) {
    // 3001 = Portal App
    // 3000 = Site App
    const devLogoutUrls = [3001, 3000].map((port) => `http://localhost:${port}/auth/logout/`);
    logoutUrls = [...logoutUrls, devLogoutUrls].flat();
  }

  return logoutUrls;
}
