import { Config } from "@serverless-stack/node/config";
import { procedure } from "@sst-app/trpc";

import { fetchCognito } from "../../utils/fetchCognito";
import { userInfoInputSchema, userInfoOutputSchema } from "../../validators/userInfo";

/**
 * User Info
 */
export const userInfo = procedure
  .input(userInfoInputSchema)
  .output(userInfoOutputSchema)
  .query(async ({ input }) => {
    return fetchCognito(`${Config.COGNITO_BASE_URL}/oauth2/userInfo`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
      },
    });
  });
