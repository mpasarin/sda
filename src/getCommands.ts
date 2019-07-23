import { isArray, isString } from 'util';
import { IEnvironment, ITemplate } from './interfaces';
import Log from './Log';

export interface IParsedCommand {
  id: string;
  cmd: string[];
  cwd?: string;
}

export default function getCommands(environment: IEnvironment, commandNames: string[]): IParsedCommand[] {
  const cmds: IParsedCommand[] = [];
  for (const cmdName of commandNames) {
    const cmd = getCommand(environment.template, cmdName);
    if (cmd) {
      cmds.push(cmd);
    }
  }
  return cmds;
}

function getCommand(template: ITemplate, cmdName: string): IParsedCommand | undefined {
  let command = template.commands[cmdName];
  if (!command) {
    Log.error(`Error: Command "${cmdName}" not found in template "${template.id}"`);
    return undefined;
  }

  // Fix up shorthand for commands
  if (isString(command)) {
    command = { cmd: [command] };
  } else if (isArray(command)) {
    command = { cmd: command };
  } else if (isString(command.cmd)) {
    command.cmd = [command.cmd];
  } else if (isString(command.filePath)) {
    let filePath = command.filePath;
    if (isString(command.interpreter)) {
      filePath = `${command.interpreter} ${command.filePath}`;
    }
    command.cmd = [filePath];
  }

  return {
    id: cmdName,
    cmd: command.cmd as string[],
    cwd: command.cwd
  };
}
