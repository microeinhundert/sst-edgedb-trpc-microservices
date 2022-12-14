import { env } from "../env";

export function getAuthCallbackUrls(isDevStage?: boolean) {
  let callbackUrls = [env.SITE_DOMAIN_NAME].map(
    (domainName) => `https://${domainName}/auth/callback/`
  );

  if (isDevStage) {
    // 3000 = Site App
    const devCallbackUrls = [3000].map((port) => `http://localhost:${port}/auth/callback/`);
    callbackUrls = [...callbackUrls, devCallbackUrls].flat();
  }

  return callbackUrls;
}

export function getAuthLogoutUrls(isDevStage?: boolean) {
  let logoutUrls = [env.SITE_DOMAIN_NAME].map((domainName) => `https://${domainName}/auth/logout/`);

  if (isDevStage) {
    // 3000 = Site App
    const devLogoutUrls = [3000].map((port) => `http://localhost:${port}/auth/logout/`);
    logoutUrls = [...logoutUrls, devLogoutUrls].flat();
  }

  return logoutUrls;
}
