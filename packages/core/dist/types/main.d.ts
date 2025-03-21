export declare function decryptConfigObject<T>(object: Record<string, unknown>, encryptionKey: CryptoKey): Promise<T>;
export declare function decodeEncryptionKey(encryptionKey: string): Promise<CryptoKey>;
export declare function decryptConfigValue(text: string, encryptionKey: CryptoKey, iv: Buffer): Promise<string>;
export * as zod from 'zod';
