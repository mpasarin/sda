import { isArray, isString } from 'util';
import { ICommand, IEnvironment, ITemplate } from './interfaces';
import Log from './Log';

export default function getCommands(environment: IEnvironment, commandNames: string[]): ICommand[] {
  const cmds: ICommand[] = [];
  for (const cmdName of commandNames) {
    const cmd = getCommand(environment.template, cmdName);
    if (cmd) {
      cmds.push(cmd);
    }
  }
  return cmds;
}

function getCommand(template: ITemplate, cmdName: string): ICommand | undefined {
  let command = template.commands[cmdName];
  if (!command) {
    Log.error(`Command "${cmdName}" not found in template "${template.id}"`);
    return undefined;
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
