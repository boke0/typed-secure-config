import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';

export function getSecrets(configDir: string): Record<string, Buffer> {
  const file = path.join(configDir, '_secrets.json');
  const secrets: Record<string, string> = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return Object.fromEntries(
    Object.entries(secrets).map(([env, secret]) => {
      return [env, Buffer.from(secret, 'hex')];
    })
  )
}

export function getSecret(configDir: string, env: string): Buffer {
  const secrets = getSecrets(configDir);
  if (!(env in secrets)) {
    throw new Error(`No secret for environment ${env}`);
  }
  return secrets[env];
}

export function createSecret(): Buffer {
  return crypto.randomBytes(32);
}

export function writeSecretsFile(configDir: string, secrets: Record<string, Buffer>) {
  return fs.writeFileSync(
    path.join(configDir, '_secrets.json'),
    JSON.stringify(
      Object.fromEntries(
        Object.entries(secrets).map(([env, secret]) => [
          env,
          secret.toString('hex')
        ])
      ),
      null,
      2
    )
  );
}
