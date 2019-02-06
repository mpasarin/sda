# sda - Software development assistant

## What is sda?
sda is a command-line tool that intends to simplify life of a software developer when working in different environments,
with different tools and processes, at the same time.

For a single project, using `npm` commands or `gulp` can be a better option, but for managing different projects at the
same, a developer can define it's own set of commands.

## Usage
```sh
# install sda
npm install -g sda

# set up your .sdaconfig in your root folder

# run sda within your root folder
sda <command>
```

## Configuration file
A config file defines the different environment definitions, and the environments that are supported.

The file must be named `.sdaconfig` and be in a folder containing the different environments.

```json
{
  "definitions": {
    "<definitionId>": {
      "commands": {
        "<quickCommand>": "echo quick command",
        "<cliCommand>": {
          "cmd": "pwd",
          "cwd": "C:\\"
        }
      }
    }
  },
  "environments": {
    "<myEnvironment>": {
      "path": "<pathToEnvironmentRoot>",
      "definition": "<definitionId>"
    }
  }
}
```