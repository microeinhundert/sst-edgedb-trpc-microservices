import { Config } from "@serverless-stack/node/config";
import { getSecretValue } from "@sst-app/lambda-utils";
import { createClient } from "edgedb";

const connection = JSON.parse(await getSecretValue(Config.EDGEDB_DSN_SECRET)) as { dsn: string };

export const client = createClient({
  dsn: connection.dsn,
  tlsSecurity: "insecure",
});
