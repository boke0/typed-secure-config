interface Options {
    encryptionKey: string;
    directory?: string;
    file?: string;
}
export default function typedSecureConfig<T>(options: Options): Promise<T>;
export declare function decryptConfigObject(object: Record<string, unknown>, encryptionKey: Buffer): Record<string, unknown>;
export declare function decryptConfigValue(text: string, encryptionKey: Buffer, iv: Buffer): string;
export * as zod from 'zod';
