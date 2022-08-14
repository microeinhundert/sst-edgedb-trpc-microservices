import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { env } from "@sst-app/lambda-env";

export const client = new CognitoIdentityProviderClient({ region: env.REGION });
