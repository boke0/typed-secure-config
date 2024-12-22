import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
export default async function typedSecureConfig(options) {
    const directory = options.directory ?? 'config';
    const file = options.file ?? 'default.json';
    const config = JSON.parse(fs.readFileSync(path.join(directory, file), options.encoding ?? 'utf8'));
    const encryptionKey = Buffer.from(options.encryptionKey, 'hex');
    return decryptConfigObject(config, encryptionKey);
}
export function decodeEncryptionKey(encryptionKey) {
    return Buffer.from(encryptionKey, 'hex');
}
export function decryptConfigObject(object, encryptionKey) {
    const decryptedConfigObject = {};
    for (const key in object) {
        if (!object[key] || typeof object[key] !== 'object') {
            decryptedConfigObject[key] = object[key];
        }
        else if ('_encrypted' in object[key] && '_iv' in object[key]) {
            decryptedConfigObject[key] = decryptConfigValue(object[key]['_encrypted'], encryptionKey, Buffer.from(object[key]['_iv'], 'hex'));
        }
        else {
            decryptedConfigObject[key] = decryptConfigObject(object[key], encryptionKey);
        }
    }
    return decryptedConfigObject;
}
export function decryptConfigValue(text, encryptionKey, iv) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
    const decrypted = decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}
export * as zod from 'zod';
