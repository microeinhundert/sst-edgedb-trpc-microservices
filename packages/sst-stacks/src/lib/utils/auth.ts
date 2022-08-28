import { env } from "../env";

export function getAuthCallbackUrls(isDevStage?: boolean) {
  let callbackUrls = [env.SITE_DOMAIN_NAME].map((domainName) => `https://${domainName}/`);

  if (isDevStage) {
    // 3000 = Site App
    const devCallbackUrls = [3000].map((port) => `http://localhost:${port}/`);
    callbackUrls = [...callbackUrls, devCallbackUrls].flat();
  }

  return callbackUrls;
}

export function getAuthLogoutUrls(isDevStage?: boolean) {
  return getAuthCallbackUrls(isDevStage).map((callbackUrl) => `${callbackUrl}logout/`);
}
