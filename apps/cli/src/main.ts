#!/usr/bin/env node

import { input, select } from '@inquirer/prompts';
import { Command } from 'commander';
import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import * as path from 'node:path';

import { createSecret, getSecret, getSecrets, writeSecretsFile } from './secrets.js';
import { getConfigValue, readConfigFile, setConfigValue, whiteConfigFile } from './config.js';
import { decryptConfigValue } from '@typed-secure-config/core';

const program = new Command();

interface EnvOptions {
  configDir: string;
  env: string;
}

interface SetValueOptions extends EnvOptions {
  key: string;
}

const configSchemaFile = `
export default interface Config {
  // Add your config type definition here
}
`.trim()

program
  .name('typed-secure-config')
  .version('1.0.0')
  .description('A CLI for managing a config file')
  .option('-c, --config-dir <config-dir>', 'The path to the config file', 'config')
  .option('-e, --env <config-dir>', 'The environment to set the value in')

program
  .command('init')
  .description('Set a value in the config')
  .action(async () => {
    const configDir = await input({
      message: 'Enter the path to place the config file',
      default: './config/',
    });
    fs.mkdirSync(path.resolve(configDir), { recursive: true });
    fs.writeFileSync(path.join(configDir, '.gitignore'), '_secrets.json', { flag: 'w' });
    fs.writeFileSync(path.join(configDir, 'types.ts'), configSchemaFile, { flag: 'w' });
    writeSecretsFile(configDir, {});
  })

program
  .command('add-env')
  .description('Add a new environment to the config')
  .action(async () => {
    const options = program.opts()
    const configDir = path.resolve(options.configDir ?? "config");
    const env = await input({
      message: 'Enter the new environment name',
    })
    const newSecret = createSecret();
    const secrets = getSecrets(configDir);
    writeSecretsFile(configDir, { ...secrets, [env]: newSecret });
    fs.writeFileSync(path.join(configDir, `${env}.json`), JSON.stringify({}, null, 2), { flag: 'w' });
  })

program
  .command('set')
  .description('Set a value in the config')
  .option('-k, --key <key>', 'The key to set')
  .action(async (commandOptions: Partial<SetValueOptions>) => {
    const options = {
      ...commandOptions,
      ...program.opts()
    }
    const { configDir, env, key } = await inquireSetValueOptions(options);
    const value = await input({
      message: 'Enter a value',
    });
    const config = readConfigFile(configDir, env);
    whiteConfigFile(configDir, env, setConfigValue(config, key, value));
  })

program
  .command('get')
  .description('Get a value in the config')
  .option('-k, --key <key>', 'The key to set')
  .action(async (commandOptions: Partial<SetValueOptions>) => {
    const options = {
      ...commandOptions,
      ...program.opts(),
    }
    const { configDir, env, key } = await inquireSetValueOptions(options);
    const config = readConfigFile(configDir, env);
    const value = getConfigValue(config, key);
    if (typeof value === 'string') {
      console.log(value);
    } else {
      console.log("***ENCRYPTED***");
    }
  })

program
  .command('set-encrypt')
  .description('Set an encrypted value in the config')
  .option('-k, --key <key>', 'The key to set')
  .action(async (commandOptions) => {
    const options = {
      ...commandOptions,
      ...program.opts(),
    }
    const { configDir, env, key } = await inquireSetValueOptions(options);
    const value = await input({
      message: 'Enter a value',
    });
    const config = readConfigFile(configDir, env);
    const secret = getSecret(configDir, env);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv);
    const crypted = Buffer.concat([cipher.update(value), cipher.final()])
    whiteConfigFile(configDir, env, setConfigValue(config, key, { _encrypted: crypted.toString('hex'), _iv: iv.toString('hex') }));
  })

program
  .command('get-encrypt')
  .description('Get an encrypted value in the config')
  .option('-k, --key <key>', 'The key to set')
  .action(async (commandOptions) => {
    const options = {
      ...commandOptions,
      ...program.opts(),
    }
    const { configDir, env, key } = await inquireSetValueOptions(options);
    const config = readConfigFile(configDir, env);
    const value = getConfigValue(config, key);
    if (typeof value === 'string') {
      console.log(value);
    } else {
      const { _encrypted: encrypted, _iv: iv } = value;
      const decryptedConfig = decryptConfigValue(
        encrypted,
        getSecret(configDir, env),
        Buffer.from(iv, 'hex')
      );
      console.log(decryptedConfig);
    }
  })

program.parse(process.argv);

function listEnv(configDir: string): Array<string> {
  const secret = getSecrets(configDir);
  return Array.from(Object.keys(secret))

}

async function inquireEnvOptions(options: Partial<EnvOptions>): Promise<EnvOptions> {
  const configDir = path.resolve(options.configDir ?? "config");
  const env = options.env ?? await select({
    message: 'Select an environment',
    choices: listEnv(configDir).map(env => ({
      name: env,
      value: env,
    }))
  });
  return {
    configDir,
    env,
  }
}

async function inquireSetValueOptions(options: Partial<SetValueOptions>): Promise<SetValueOptions> {
  return {
    ...await inquireEnvOptions(options),
    key: options.key ?? await input({
      message: 'Enter a key (split by "." to nest)',
    })
  }
}

