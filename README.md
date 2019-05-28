# sda - Software development assistant

## What is sda?
sda is a command-line tool that intends to simplify life of a software developer when working in different environments,
with different tools and processes, at the same time.

For a single project, using `npm` commands or `gulp` can be a better option, but for managing different projects at the
same time, a developer can define their own set of commands.

## Usage
```sh
# install sda
npm install -g sda

# set up your .sdaconfig file

# run sda inside of your environment
sda <command>
```

### Options
`sda <command>` runs a specific command in the current environment.

`sda <command1> <command2>` runs multiple commands, one after the other, in the current environment.

`sda <environment> <command>` runs a command in a specific environment.

`sda -a <command>` / `sda --all <command>` runs a command in all environments.

## Configuration file
A config file defines the different environment definitions, and the environments that are supported.

The file must be named `.sdaconfig` and be in a folder containing the different environments.

```json
{
  "templates": {
    "<templateId>": {
      "commands": {
        "<quickCommand>": "echo quick command",
        "<multipleCommands>": [
          "echo first command",
          "echo second command"
        ],
        "<commandInFolder>": {
          "cmd": "pwd",
          "cwd": "C:\\"
        },
        "<multipleCommandsInFolder>": {
          "cmd": ["pwd", "echo second command"],
          "cwd": "C:\\"
        }
      }
    }
  },
  "environments": {
    "<environmentId>": {
      "path": "<pathToEnvironmentRoot>",
      "templateId": "<templateId>"
    }
  }
}
```