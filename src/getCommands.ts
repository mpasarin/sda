import { isArray, isString } from 'util';
import { ICommand, IEnvironment } from './interfaces';
import { IConfigTemplate } from './interfaces/IConfig';

export default function getCommands(environment: IEnvironment, commandNames: string[]): ICommand[] {
  const cmds: ICommand[] = [];
  for (const cmdName of commandNames) {
    if (cmdName !== environment.id) {
      cmds.push(getCommand(environment.template!, cmdName));
    }
  }
  return cmds;
}

function getCommand(template: IConfigTemplate, cmdName: string): ICommand {
  let command = template.commands[cmdName];
  if (!command) {
    throw new Error(`Command "${cmdName}" does not exist`);
  }

  // Fix up shorthand for commands
  if (isString(command)) {
    command = { cmd: [command] };
  } else if (isArray(command)) {
    command = { cmd: command };
  } else if (isString(command.cmd)) {
    command.cmd = [command.cmd];
  }

  return {
    id: cmdName,
    ...command
  };
}
