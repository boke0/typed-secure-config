import * as path from 'node:path';
import * as crypto from 'node:crypto';

interface Options {
  encryptionKey: string;
  directory?: string;
  file?: string;
}

export default async function typedSecureConfig<T>(options: Options): Promise<T> {
  const directory = options.directory ?? 'config';
  const file = options.file ?? 'default.json';
  return import(path.join(directory, file), { assert: { type: 'json' } }).then((config) => {
    const encryptionKey = Buffer.from(options.encryptionKey, 'hex');
    return decryptConfigObject(config.default, encryptionKey)
  })
}

export function decodeEncryptionKey(encryptionKey: string): Buffer {
  return Buffer.from(encryptionKey, 'hex');
}

export function decryptConfigObject<T>(object: Record<string, unknown>, encryptionKey: Buffer): T {
  const decryptedConfigObject: Record<string, unknown> = {};
  for (const key in object) {
    if (!object[key] || typeof object[key] !== 'object') {
      decryptedConfigObject[key] = object[key]
    } else if ('_encrypted' in object[key] && '_iv' in object[key]) {
      decryptedConfigObject[key] = decryptConfigValue(
        object[key]['_encrypted'] as string,
        encryptionKey,
        Buffer.from(object[key]['_iv'] as string, 'hex')
      );
    } else {
      decryptedConfigObject[key] = decryptConfigObject(object[key] as Record<string, unknown>, encryptionKey);
    }
  }
  return decryptedConfigObject as T;
}

export function decryptConfigValue(text: string, encryptionKey: Buffer, iv: Buffer) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  const decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
}

export * as zod from 'zod';
