import { Buffer } from 'node:buffer';
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
export async function decodeEncryptionKey(encryptionKey) {
    return await crypto.subtle.importKey('raw', Buffer.from(encryptionKey, 'hex'), {
        name: 'AES-CBC',
        length: 256
    }, true, ['encrypt', 'decrypt']);
}
export async function decryptConfigValue(text, encryptionKey, iv) {
    const decipher = await crypto.subtle.decrypt({
        name: 'AES-CBC',
        iv,
    }, encryptionKey, Buffer.from(text, 'hex'));
    return new TextDecoder().decode(decipher);
}
export * as zod from 'zod';
