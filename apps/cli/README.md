Typed Secure Config CLI
===

**Typed Secure Config** is a CLI tool for managing configuration files, with support for multiple environments and encryption. It provides a simple, interactive interface for setting and retrieving configuration values.

## Installation

Install the CLI tool via npm:

```bash
npm install -g typed-secure-config
```

## Usage

The CLI provides commands to initialize, manage, and retrieve configuration values. Below are the general options and available commands.

### General Options

```plaintext
-V, --version                  Output the version number
-c, --config-dir <config-dir>  Specify the path to the config file (default: "config")
-e, --env <environment>        Specify the environment to use for the operation
-h, --help                     Display help for commands
```

### Commands

#### `init`
Initialize a config dir into the project.

```bash
typed-secure-config init
```

#### `add-env`
Add a new environment to the configuration.

```bash
typed-secure-config add-env
```

#### `set [options]`
Set a value in the configuration.

Example:
```bash
typed-secure-config set
```

Or, you can specify the key option:
```
typed-secure-config set -k apiKey
```

#### `get [options]`
Get a value from the configuration.

Example:
```bash
typed-secure-config get
```

Or, you can specify the key option:
```
typed-secure-config get -k apiKey
```

#### `set-encrypt [options]`
Set an encrypted value in the configuration.

Example:
```bash
typed-secure-config set-encrypt
```

Or, you can specify the key option:
```
typed-secure-config set-encrypt -k apiKey
```

#### `get-encrypt [options]`
Get an encrypted value in the configuration.

Example:
```bash
typed-secure-config get-encrypt
```

Or, you can specify the key option:
```
typed-secure-config get-encrypt -k apiKey
```
