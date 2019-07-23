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

# set up your sdaconfig.json file in your user home folder

# run sda inside of your environment
sda <command>
```

### Options
`sda <command>` runs a specific command in the current environment.

`sda <command1> <command2>` runs multiple commands, one after the other, in the current environment.

`sda <environment> <command>` runs a command in a specific environment.

`sda -a <command>` / `sda --all <command>` runs a command in all environments.

`sda -c <configPath> ...` / `sda --config <configPath> ...` runs sda with the specified config file (in addition to the regular config file).

`sda <command1> <command2> <-param1> <-param2>` runs multiple commands, one after the other, and applies any valid params (based on the validParams property for each command) to the commands. Each param will only be applied to those commands that list that param in the validParams property.

## Configuration file
A config file defines the different environment definitions and the environments that are supported.

A config file must be named `sdaconfig.json` and be in a parent folder containing the different environments or the user home folder.

The user home config file takes precedence over other ones.

### Schema

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
        },
        "<commandWithParameters>": {
          "cmd": "ls",
          "validParams": ["-a", "-l"]
        },
        "<commandWithParameterPlaceholder>": {
          "cmd": "ls %PARAM% && echo second command",
          "validParams": ["-a", "-l"]
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