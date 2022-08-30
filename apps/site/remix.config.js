/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverDependenciesToBundle: [/^@sst-app*/],
  ignoredRouteFiles: ["**/.*"],
};
