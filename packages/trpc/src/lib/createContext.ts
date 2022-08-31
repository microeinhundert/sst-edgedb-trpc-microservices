import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { Config } from "@serverless-stack/node/config";
import { client as edgeDBClient } from "@sst-app/edgedb";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2WithJWTAuthorizer } from "aws-lambda";

export const cognitoClient = new CognitoIdentityProviderClient({ region: Config.REGION });

export const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2WithJWTAuthorizer>) => {
  // Add data from the request context here,
  // like the currently authenticated user
  const scopedEdgeDBClient = edgeDBClient.withGlobals({
    current_user_email: "",
  });

  return {
    db: scopedEdgeDBClient,
    auth: cognitoClient,
    lambdaEvent: event,
    lambdaContext: context,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
