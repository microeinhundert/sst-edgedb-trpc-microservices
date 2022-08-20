import { client as edgeDBClient } from "@sst-app/edgedb";
import type { inferAsyncReturnType } from "@trpc/server";
import type { CreateAWSLambdaContextOptions } from "@trpc/server/adapters/aws-lambda";
import type { APIGatewayProxyEventV2 } from "aws-lambda";

import { client as cognitoClient } from "./cognitoClient";

export const createContext = ({
  event,
  context,
}: CreateAWSLambdaContextOptions<APIGatewayProxyEventV2>) => ({
  db: edgeDBClient,
  auth: cognitoClient,
  lambdaEvent: event,
  lambdaContext: context,
});

export type Context = inferAsyncReturnType<typeof createContext>;
