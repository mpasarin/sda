# sda - Software development assistant

## What is sda?
sda is a command-line tool that intends to simplify life of a software developer when working in different repositories, with different environments, tools and processes; at the same time.

For a single project, using `npm` commands or `gulp` can be a better option, but for managing different projects at the same time, a developer can define their own set of commands.

## Usage
```sh
# install sda
npm install -g sda

# <Optional> install SDA configuration packages
# set up your sdaconfig.json file in your user home folder

# run sda inside of your environment
sda <command>
```

### Run commands
`sda <command> ... <param?> ...` - Run one command or many commands at once. Parameters affect all commands.

`sda <alias> ... <param?> ...` - Run command specified by an alias. Aliases can be combined and used interchangeably with commands.

`sda <env> <command>`         - Run the commands in a specific environment.

`sda [--all | -a] <command>`  - Run the commands in all environments.

`sda -c <configPath> ...` / `sda --config <configPath> ...` runs sda with the specified config file (in addition to the regular config file).

### Set up environments
`sda [setup | s] <template> <folder?>` sets up a new environment in the specified folder, or the current folder.

`sda [attach | a] <template> <folder?>` attaches a template to a folder, or the current folder.

### Explore your configuration
`sda [list | l]`            - List all environments in SDA.

`sda <env> [list | l]`      - List all commands for an environment.

`sda [listTemplates | lt]`  - List all templates in SDA.

### Other options
  `sda [help | h]`                        - Show help.

  `sda ... [--config | -c] <configFile>`  - Use a specific configuration file.

  `sda ... -v`                            - Show verbose comments.


## Configuration file
A config file defines the different environment definitions and the environments that are supported.

A config file must be named `sdaconfig.json`

The config file can be placed in:
* The current or a parent folder from the working directory where SDA is run. This is useful to add a SDA config file in the same place as the environment.
* A SDA configuration package (see below)
* The user home folder (`C:\Users\<username>` or `/home/<username>`)

The home folder config overrides any configuration from the environment or packages, allowing the user to customize the configuration for their specific needs.

### Configuration packages

You can re-use SDA configuration file by packaging them. Name your package `sda-*` and add a `sdaconfig.json` file in the root folder of the package.

After installing the package the configuration file will be always available. Any configuration coming from the package can be overridden by the home folder config file.

### Environments and templates

An environment is defined by a *path* and a *template*. The *path* is the root folder for the environment, and the *template* defines the commands that are available for the environment.

This is useful when there are multiple copies of the same environment in the machine, as the template is shared.

There is a special template id called `default`. If the `default` template is defined, its commands and aliases will apply to all templates. This can be useful to define useful commands that are not scoped to a specific template, for example complex commands in git.

### Sample configuration file

```json
{
  "templates": {
    "<templateId>": {
      "description": "(Optional) This is the description of the template",
      "gitRepo": "(Optional) <git repository>",
      "aliases (Optional)": {
        "<alias>": "<commandName>"
      },
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
        },
        "pre-setup": "(Optional) <command to execute before cloning the git repo",
        "post-setup": "(Optional) <command to execute after cloning the git repo"
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