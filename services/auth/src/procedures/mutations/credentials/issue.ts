import { Config } from "@serverless-stack/node/config";
import { procedure } from "@sst-app/trpc";

import { fetchCognito } from "../../../utils/fetchCognito";
import {
  issueCredentialsInputSchema,
  issueCredentialsOutputSchema,
} from "../../../validators/issueCredentials";

/**
 * Issue
 */
export const issue = procedure
  .input(issueCredentialsInputSchema)
  .output(issueCredentialsOutputSchema)
  .mutation(async ({ input }) => {
    return fetchCognito(`${Config.COGNITO_BASE_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: Config.COGNITO_USER_POOL_CLIENT_ID,
        redirect_uri: input.redirectUri,
        code: input.code,
      }),
    });
  });
