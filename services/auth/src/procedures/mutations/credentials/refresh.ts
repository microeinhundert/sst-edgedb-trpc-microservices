import { Config } from "@serverless-stack/node/config";
import { procedure } from "@sst-app/trpc";

import { fetchCognito } from "../../../utils/fetchCognito";
import {
  refreshCredentialsInputSchema,
  refreshCredentialsOutputSchema,
} from "../../../validators/refreshCredentials";

/**
 * Refresh
 */
export const refresh = procedure
  .input(refreshCredentialsInputSchema)
  .output(refreshCredentialsOutputSchema)
  .mutation(async ({ input }) => {
    return fetchCognito(`${Config.COGNITO_BASE_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: Config.COGNITO_USER_POOL_CLIENT_ID,
        redirect_uri: input.redirectUri,
        refresh_token: input.refreshToken,
      }),
    });
  });
