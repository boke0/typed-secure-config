interface Options {
    encryptionKey: string;
    directory?: string;
    file?: string;
    encoding?: 'utf8' | 'ascii';
}
export default function typedSecureConfig<T>(options: Options): Promise<T>;
export declare function decodeEncryptionKey(encryptionKey: string): Buffer;
export declare function decryptConfigObject<T>(object: Record<string, unknown>, encryptionKey: Buffer): T;
export declare function decryptConfigValue(text: string, encryptionKey: Buffer, iv: Buffer): string;
export * as zod from 'zod';
