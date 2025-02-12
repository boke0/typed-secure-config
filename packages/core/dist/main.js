import * as fs from 'node:fs';
import * as path from 'node:path';
export default async function typedSecureConfig(options) {
    const directory = options.directory ?? 'config';
    const file = options.file ?? 'default.json';
    const config = JSON.parse(fs.readFileSync(path.join(directory, file), options.encoding ?? 'utf8'));
    const encryptionKey = await decodeEncryptionKey(options.encryptionKey);
    return await decryptConfigObject(config, encryptionKey);
}
export async function decodeEncryptionKey(encryptionKey) {
    return await crypto.subtle.importKey('raw', Buffer.from(encryptionKey, 'hex'), {
        name: 'AES-CBC',
        length: 256
    }, true, ['encrypt', 'decrypt']);
}
export async function decryptConfigObject(object, encryptionKey) {
    const decryptedConfigObject = {};
    for (const key in object) {
        if (!object[key] || typeof object[key] !== 'object') {
            decryptedConfigObject[key] = object[key];
        }
        else if ('_encrypted' in object[key] && '_iv' in object[key]) {
            decryptedConfigObject[key] = await decryptConfigValue(object[key]['_encrypted'], encryptionKey, Buffer.from(object[key]['_iv'], 'hex'));
        }
        else {
            decryptedConfigObject[key] = await decryptConfigObject(object[key], encryptionKey);
        }
    }
    return decryptedConfigObject;
}
export async function decryptConfigValue(text, encryptionKey, iv) {
    const decipher = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv,
    }, encryptionKey, Buffer.from(text, 'hex'));
    return new TextDecoder().decode(decipher);
}
export * as zod from 'zod';
