import type { StackContext } from "@serverless-stack/resources";
import { Config } from "@serverless-stack/resources";
import { EdgeDB } from "@sst-app/cdk-constructs";
import { Vpc } from "aws-cdk-lib/aws-ec2";

import { env } from "./env";

export function PersistenceStack({ stack }: StackContext) {
  const vpc = new Vpc(stack, "Vpc", {
    natGateways: 0,
    maxAzs: 2,
  });

  const edgeDB = new EdgeDB(stack, "EdgeDB", {
    vpc,
    databaseName: "edgedb",
    instanceCount: +env.EDGEDB_INSTANCE_COUNT,
    domain: {
      name: env.EDGEDB_DOMAIN_NAME,
      zoneName: env.ROUTE53_ZONE_NAME,
      hostedZoneId: env.ROUTE53_HOSTED_ZONE_ID,
    },
  });

  const edgeDBParameters = {
    EDGEDB_CONNECTION_SECRET_ARN: new Config.Parameter(stack, "EDGEDB_CONNECTION_SECRET_ARN", {
      value: edgeDB.connectionSecret.secretArn,
    }),
  };

  return { edgeDB, edgeDBParameters };
}
