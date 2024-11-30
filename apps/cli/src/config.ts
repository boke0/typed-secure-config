import * as path from "node:path";
import * as fs from 'node:fs';

export interface EncryptedValue {
  _encrypted: string;
  _iv: string;
}

export function readConfigFile(configDir: string, env: string) {
  const file = path.join(configDir, `${env}.json`);
  const config = JSON.parse(fs.readFileSync(file, 'utf-8'));
  return config;
}

export function whiteConfigFile(configDir: string, env: string, config: Record<string, unknown>) {
  const file = path.join(configDir, `${env}.json`);
  return fs.writeFileSync(file, JSON.stringify(config, null, 2));
}

export function setConfigValue(config: Record<string, unknown>, key: string, value: string | EncryptedValue) {
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
    current = current[key] as Record<string, unknown>;
  });
  current[lastKey!] = value;
  return config;
}

export function getConfigValue(config: Record<string, unknown>, key: string): string | EncryptedValue {
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
    current = current[key] as Record<string, unknown>;
  });
  return current[lastKey!] as string | EncryptedValue;
}
