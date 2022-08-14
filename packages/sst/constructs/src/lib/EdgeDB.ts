import { Duration, SecretValue } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecsPatterns from "aws-cdk-lib/aws-ecs-patterns";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

interface EdgeDBDatabaseCluster {
  databaseCluster: rds.IDatabaseCluster;
  databaseClusterDSNSecret: secretsmanager.ISecret;
}

export interface EdgeDBDomainProps {
  name: string;
  zoneName: string;
  hostedZoneId: string;
}

export interface EdgeDBProps {
  vpc: ec2.IVpc;
  databaseName: string;
  instanceCount: number;
  domain?: EdgeDBDomainProps;
  certificateSecret?: secretsmanager.ISecret;
}

export class EdgeDB extends Construct {
  private _port = 5656;
  private _props: EdgeDBProps;

  public connectionSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: EdgeDBProps) {
    super(scope, id);

    this._props = props;

    const databaseCluster = this._createDatabaseCluster();
    this.connectionSecret = this._createFargateService(databaseCluster);
  }

  private _createDatabaseCluster(): EdgeDBDatabaseCluster {
    const databaseCluster = new rds.DatabaseCluster(this, "DatabaseCluster", {
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_13_7,
      }),
      instanceProps: {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        vpc: this._props.vpc,
      },
      instances: this._props.instanceCount,
      defaultDatabaseName: this._props.databaseName,
    });

    const databaseClusterDSNSecret = new secretsmanager.Secret(this, "DatabaseClusterDSN", {
      secretStringValue: SecretValue.unsafePlainText(
        `postgres://${databaseCluster.secret?.secretValueFromJson(
          "username"
        )}:${databaseCluster.secret?.secretValueFromJson("password")}@${
          databaseCluster.clusterEndpoint.hostname
        }:${databaseCluster.secret?.secretValueFromJson(
          "port"
        )}/${databaseCluster.secret?.secretValueFromJson("dbname")}`
      ),
    });

    return { databaseCluster, databaseClusterDSNSecret };
  }

  private _createFargateService({
    databaseClusterDSNSecret,
    databaseCluster,
  }: EdgeDBDatabaseCluster): secretsmanager.ISecret {
    const userSecret = new secretsmanager.Secret(this, "User", {
      generateSecretString: {
        excludePunctuation: true,
      },
    });

    const passwordSecret = new secretsmanager.Secret(this, "Password", {
      generateSecretString: {
        excludePunctuation: true,
      },
    });

    const fargateService = new ecsPatterns.NetworkLoadBalancedFargateService(
      this,
      "FargateService",
      {
        vpc: this._props.vpc,
        memoryLimitMiB: 2048,
        cpu: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("edgedb/edgedb"),
          containerPort: this._port,
          environment: {
            EDGEDB_SERVER_DATABASE: this._props.databaseName,
            EDGEDB_SERVER_TLS_CERT_MODE: this._props.certificateSecret
              ? "require_file"
              : "generate_self_signed",
          },
          secrets: {
            EDGEDB_SERVER_USER: ecs.Secret.fromSecretsManager(userSecret),
            EDGEDB_SERVER_PASSWORD: ecs.Secret.fromSecretsManager(passwordSecret),
            EDGEDB_SERVER_BACKEND_DSN: ecs.Secret.fromSecretsManager(databaseClusterDSNSecret),
            ...(this._props.certificateSecret
              ? {
                  EDGEDB_SERVER_TLS_KEY: ecs.Secret.fromSecretsManager(
                    this._props.certificateSecret,
                    "keyPem"
                  ),
                  EDGEDB_SERVER_TLS_CERT: ecs.Secret.fromSecretsManager(
                    this._props.certificateSecret,
                    "certPem"
                  ),
                }
              : {}),
          },
        },
        desiredCount: this._props.instanceCount,
        publicLoadBalancer: true,
        healthCheckGracePeriod: Duration.minutes(2),
        minHealthyPercent: 100,
        maxHealthyPercent: 200,
        listenerPort: this._port,
        assignPublicIp: true,
      }
    );

    // Allow communication to the Aurora PostgreSQL backend from EdgeDB Fargate tasks
    databaseCluster.connections.allowDefaultPortFrom(fargateService.service);

    // Allow communication from the Network Load Balancer to the EdgeDB Fargate tasks
    fargateService.service.connections.allowFromAnyIpv4(ec2.Port.tcp(this._port));

    // https://github.com/edgedb/edgedb-deploy/blob/2dd48d538b1d785efcf89bc5b1cd83d835c8ad2e/aws-cf/edgedb-aurora.yml#L556
    fargateService.targetGroup.configureHealthCheck({
      path: "/server/status/ready",
      interval: Duration.seconds(10),
      unhealthyThresholdCount: 2,
      healthyThresholdCount: 2,
      protocol: elbv2.Protocol.HTTPS,
    });

    fargateService.targetGroup.setAttribute("deregistration_delay.timeout_seconds", "10");

    const host = this._props.domain?.name || fargateService.loadBalancer.loadBalancerDnsName;

    const connectionSecret = new secretsmanager.Secret(this, "Connection", {
      secretStringValue: SecretValue.unsafePlainText(
        JSON.stringify({
          username: userSecret.secretValue,
          password: passwordSecret.secretValue,
          host,
          port: this._port,
          dbname: this._props.databaseName,
          dsn: `edgedb://${userSecret.secretValue}:${passwordSecret.secretValue}@${host}:${this._port}/${this._props.databaseName}`,
        })
      ),
    });

    fargateService.node.tryRemoveChild("LoadBalancerDNS");

    this._props.domain &&
      new route53.CnameRecord(this, "CnameRecord", {
        domainName: fargateService.loadBalancer.loadBalancerDnsName,
        recordName: this._props.domain.name,
        zone: route53.HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
          zoneName: this._props.domain.zoneName,
          hostedZoneId: this._props.domain.hostedZoneId,
        }),
        ttl: Duration.minutes(1),
      });

    return connectionSecret;
  }
}
