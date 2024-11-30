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

### Function Signature

```typescript
typedSecureConfig<T>(options: Options): Promise<T>
```

#### Options

| Option           | Type     | Description                                                                 |
|------------------|----------|-----------------------------------------------------------------------------|
| `encryptionKey`  | `string` | The encryption key (in hexadecimal format) used to decrypt the configuration file. |
| `directory`      | `string` | (Optional) Path to the directory containing the configuration file. Defaults to `"config"`. |
| `file`           | `string` | (Optional) Name of the configuration file. Defaults to `"default.json"`.     |

### Example Usage

#### Configuration File (`config/default.json`)

```json
{
  "apiKey": {
    "_encrypted": "<ENCRYPTED HEX CODE>",
    "_iv": "<IV HEX CODE>"
  },
  "databasePassword": "<PLAIN TEXT>"
}
```

#### Decrypting Configuration

```javascript
import typedSecureConfig from 'typed-secure-config';

async function loadConfig() {
  const config = await typedSecureConfig({
    encryptionKey: '<ENCRYPTION KEY HEX CODE>',
    directory: 'config', // Optional, defaults to 'config'
    file: 'default.json' // Optional, defaults to 'default.json'
  });

  console.log(config);
}

loadConfig().catch(console.error);
```

### Return Value

The function returns a `Promise<T>` where `T` is the type of your configuration object. You can use TypeScript to define the shape of your configuration for better type safety.

#### Example with TypeScript

```typescript
interface Config {
  apiKey: string;
  databasePassword: string;
}

async function loadConfig() {
  const config = await typedSecureConfig<Config>({
    encryptionKey: '<ENCRYPTION KEY HEX CODE>',
  });

  console.log(config.apiKey); // Type-safe access
}
```

### Error Handling

If the configuration file cannot be found or decrypted, the returned `Promise` will reject with an error. Use `try...catch` or `.catch()` to handle errors gracefully.

### Default Values

If no `directory` or `file` is provided:
- The library defaults to loading `config/default.json`.

---

## Security Notes

- Ensure that the `encryptionKey` is stored securely (e.g., environment variables or a secure key management system).
- Only trusted users should have access to the configuration directory.
