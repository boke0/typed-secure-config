import * as path from "node:path";
import * as fs from 'node:fs';
export function readConfigFile(configDir, env) {
    const file = path.join(configDir, `${env}.json`);
    const config = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return config;
}
export function whiteConfigFile(configDir, env, config) {
    const file = path.join(configDir, `${env}.json`);
    return fs.writeFileSync(file, JSON.stringify(config, null, 2));
}
export function setConfigValue(config, key, value) {
    const keys = key.split('.');
    if (keys.length === 0) {
        throw new Error('Key cannot be empty');
    }
    const lastKey = keys.pop();
    let current = config;
    keys.forEach((key) => {
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    });
    current[lastKey] = value;
    return config;
}
export function getConfigValue(config, key) {
    const keys = key.split('.');
    if (keys.length === 0) {
        throw new Error('Key cannot be empty');
    }
    const lastKey = keys.pop();
    let current = config;
    keys.forEach((key) => {
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    });
    return current[lastKey];
}
