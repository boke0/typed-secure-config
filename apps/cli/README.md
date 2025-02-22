Typed Secure Config CLI
===

**Typed Secure Config** is a CLI tool for managing configuration files, with support for multiple environments and encryption. It provides a simple, interactive interface for setting and retrieving configuration values.

## Installation

Install the CLI tool via npm:

```bash
npm install -g @typed-secure-config/cli
```

Also, by installing as dev-dependency, you can install only in your project. (Not globally)
In this way, you can run commands from npm scripts.

```bash
cd path/to/project;
npm install -D @typed-secure-config/cli
```

## Usage

The CLI provides commands to initialize, manage, and retrieve configuration values. Below are the general options and available commands.

### General Options

```plaintext
-c, --config-dir <config-dir>  Specify the path to the config file (default: "config")
-e, --env <environment>        Specify the environment to use for the operation
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

#### `get [options]`
Get a value from the configuration.

Example:
```bash
typed-secure-config get
```

#### `set-encrypted [options]`
Set an encrypted value in the configuration.

Example:
```bash
typed-secure-config set-encrypted
```

Or, you can specify the key option:
```
typed-secure-config set-encrypted -k apiKey
```

#### `get-encrypted [options]`
Get an encrypted value in the configuration.

Example:
```bash
typed-secure-config get-encrypted
```

Or, you can specify the key option:
```
typed-secure-config get-encrypted -k apiKey
```
