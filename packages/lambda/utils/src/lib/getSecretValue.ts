import { SecretsManager } from "@aws-sdk/client-secrets-manager";
import { env } from "@sst-app/lambda-env";

const secretsManager = new SecretsManager({ region: env.REGION });

export async function getSecretValue(secretId: string): Promise<string> {
  const secretValue = await secretsManager.getSecretValue({
    SecretId: secretId,
  });

  return secretValue.SecretString ?? "";
}
