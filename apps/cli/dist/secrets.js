import * as path from 'node:path';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
export function getSecrets(configDir) {
    const file = path.join(configDir, '_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return Object.fromEntries(Object.entries(secrets).map(([env, secret]) => {
        return [env, Buffer.from(secret, 'hex')];
    }));
}
export function getSecret(configDir, env) {
    const secrets = getSecrets(configDir);
    if (!(env in secrets)) {
        throw new Error(`No secret for environment ${env}`);
    }
    return secrets[env];
}
export function createSecret() {
    return crypto.randomBytes(32);
}
export function writeSecretsFile(configDir, secrets) {
    return fs.writeFileSync(path.join(configDir, '_secrets.json'), JSON.stringify(Object.fromEntries(Object.entries(secrets).map(([env, secret]) => [
        env,
        secret.toString('hex')
    ])), null, 2));
}
