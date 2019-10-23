# sda - Software development assistant

## What is sda?
sda is a command-line tool that intends to simplify life of a software developer when working in different repositories, with different environments, tools and processes; at the same time.

For a single project, using `npm` commands or `gulp` can be a better option, but for managing different projects at the same time, a developer can define their own set of commands.

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

### Environments and templates

An environment is defined by a path and a template. The path is the root folder for the environment, and the template defines the commands that are available for the environment.

This is useful when there are multiple copies of the same environment in the machine, as the template is shared.

There is a special template id called `default`. If the `default` template is defined, its commands will apply to all templates. This can be useful to define useful commands that are not scoped to a specific template, like for example complex commands in git.

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