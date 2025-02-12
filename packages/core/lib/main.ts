import * as fs from 'node:fs';
import * as path from 'node:path';

interface Options {
  encryptionKey: string;
  directory?: string;
  file?: string;
  encoding?: 'utf8' | 'ascii';
}

export default async function typedSecureConfig<T>(options: Options): Promise<T> {
  const directory = options.directory ?? 'config';
  const file = options.file ?? 'default.json';
  const config = JSON.parse(fs.readFileSync(path.join(directory, file), options.encoding ?? 'utf8'));
  const encryptionKey = await decodeEncryptionKey(options.encryptionKey);
  return await decryptConfigObject(config, encryptionKey)
}

export async function decodeEncryptionKey(encryptionKey: string): Promise<CryptoKey> {
  return await crypto.subtle.importKey(
    'raw',
    Buffer.from(encryptionKey, 'hex'),
    {
      name: 'AES-CBC',
      length: 256
    },
    true,
    ['encrypt', 'decrypt']
  )
}

export async function decryptConfigObject<T>(object: Record<string, unknown>, encryptionKey: CryptoKey): Promise<T> {
  const decryptedConfigObject: Record<string, unknown> = {};
  for (const key in object) {
    if (!object[key] || typeof object[key] !== 'object') {
      decryptedConfigObject[key] = object[key]
    } else if ('_encrypted' in object[key] && '_iv' in object[key]) {
      decryptedConfigObject[key] = await decryptConfigValue(
        object[key]['_encrypted'] as string,
        encryptionKey,
        Buffer.from(object[key]['_iv'] as string, 'hex')
      );
    } else {
      decryptedConfigObject[key] = await decryptConfigObject(object[key] as Record<string, unknown>, encryptionKey);
    }
  }
  return decryptedConfigObject as T;
}

export async function decryptConfigValue(text: string, encryptionKey: CryptoKey, iv: Buffer) {
  const decipher = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    encryptionKey,
    Buffer.from(text, 'hex')
  );
  return new TextDecoder().decode(decipher)
}

export * as zod from 'zod';
