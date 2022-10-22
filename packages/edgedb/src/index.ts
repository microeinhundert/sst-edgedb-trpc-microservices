import { Config } from "@serverless-stack/node/config";
import { getSecretValue } from "@sst-app/lambda-utils";

// @ts-ignore: Does not always exist
import e, { Cardinality, createClient } from "./lib/queryBuilder";

const connection = JSON.parse(await getSecretValue(Config.EDGEDB_CONNECTION_SECRET_ARN)) as {
  dsn: string;
};

const client = createClient({
  dsn: connection.dsn,
  tlsSecurity: "insecure",
});

export { Cardinality, client, e };
