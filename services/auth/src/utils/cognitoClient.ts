import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";

export const client = new CognitoIdentityProviderClient({ region: Config.REGION });
