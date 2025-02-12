import * as path from 'node:path';
import * as fs from 'node:fs';
import { decodeEncryptionKey } from '@typed-secure-config/core';

export async function getSecrets(configDir: string): Promise<Record<string, CryptoKey>> {
  const file = path.join(configDir, '_secrets.json');
  const secrets: Record<string, string> = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return Object.fromEntries(
    await Promise.all(
      Object.entries(secrets).map(async ([env, secret]) => {
        return [env, await decodeEncryptionKey(secret)];
      })
    )
  )
}

export async function getSecret(configDir: string, env: string): Promise<CryptoKey> {
  const secrets = await getSecrets(configDir);
  if (!(env in secrets)) {
    throw new Error(`No secret for environment ${env}`);
  }
  return secrets[env];
}

export async function createSecret(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: 'AES-CBC',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function writeSecretsFile(configDir: string, secrets: Record<string, CryptoKey>) {
  return fs.writeFileSync(
    path.join(configDir, '_secrets.json'),
    JSON.stringify(
      Object.fromEntries(
        await Promise.all(
          Object.entries(secrets).map(async ([env, secret]) => [
            env,
            Buffer.from(
              await crypto.subtle.exportKey(
                'raw',
                secret
              )
            ).toString('hex')
          ])
        )
      ),
      null,
      2
    )
  );
}
