import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { Config } from "@serverless-stack/node/config";

const secretsManager = new SecretsManager({ region: Config.REGION });

export async function getSecretValue(secretId: string) {
  const secretValue = await secretsManager.getSecretValue({
    SecretId: secretId,
  });

  return secretValue.SecretString ?? "";
}
