@typed-secure-config/core
===

**typed-secure-config** is a library for securely managing configuration files in a Node.js environment. It supports decryption of sensitive configuration values using a specified encryption key and initialization vector (IV).

## Installation

Install the library via npm:

```bash
npm install @typed-secure-config/core
```

## Usage

The library provides a default function to load and decrypt configuration files. The configuration file is expected to be a JSON file, and encrypted values are automatically decrypted during the load process.

### Importing the Library

```javascript
import typedSecureConfig from 'typed-secure-config';
```

### Example Usage

#### Configuration File (`config/default.json`)

```json
{
  "apiKey": {
    "_encrypted": "<ENCRYPTED HEX CODE>",
    "_iv": "<IV HEX CODE>"
  },
  "databaseUrl": "<PLAIN TEXT>"
}
```

#### Decrypting Configuration

You can read config files from file system:

```javascript
import typedSecureConfig from '@typed-secure-config/core';

typedSecureConfig({
  encryptionKey: '<ENCRYPTION KEY HEX CODE>',
  directory: './src/config', // Optional, defaults to 'config'
  file: 'default.json' // Optional, defaults to 'default.json'
}).then(config => {
  console.log(config);
})
```

Or, you can specify configs by importing json file directory.

```javascript
import { decryptConfigObject } from '@typed-secure-config/core';
import envConfig from 'path/to/config-dir/env.json';

async function loadConfig() {
  const encryptionKey = await decodeEncryptionKey('<ENCRYPTION KEY HEX CODE>')
  return decryptConfigObject(
    envConfig,
    encryptionKey
  ).then(config => {
    console.log(config);
    return config
  })
}

loadConfig()
```

## Security Notes

Ensure that the `encryptionKey` is stored securely (e.g., environment variables or a secure key management system).
