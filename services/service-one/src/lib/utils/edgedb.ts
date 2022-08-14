import { env } from "@sst-app/lambda-env";
import { getSecretValue } from "@sst-app/lambda-utils";
import { createClient } from "edgedb";

const connection = JSON.parse(await getSecretValue(env.EDGEDB_DSN_SECRET));

export const client = createClient({
  dsn: connection.dsn,
  tlsSecurity: "insecure",
});
