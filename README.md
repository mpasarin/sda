# sem - Simple Environment Manager

## What is sem?
sem is a command-line tool that intends to simplify life of a developer when working in different environments, with
different tools and processes, at the same time.

For a single project, using `npm` commands or `gulp` can be a better option, but for managing different projects at the
same, a developer can define it's own set of commands.

## Usage
```sh
# install sem
npm install -g sem

# set up your .semconfig in your root folder

# run sem within your root folder
sem <command>
```

## Configuration file
A config file defines the different environment definitions, and the environments that are supported.

The file must be named `.semconfig` and be in a folder containing the different environments.

```json
{
  "definitions": {
    "<definitionId>": {
      "commands": {
        "<quickCommand>": "echo quick command",
        "<cliCommand>": {
          "cmd": "pwd",
          "cwd": "C:\\"
        },
        ...
      }
    }
  },
  "environments": {
    "<myEnvironment>": {
      "path": "<pathToEnvironmentRoot>",
      "definition": "<definitionId>"
    },
    ...
  }
}
```