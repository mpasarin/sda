import { isArray, isString } from 'util';
import { IEnvironment } from '../interfaces';
import { IConfigCommand } from '../interfaces/IConfig';
import Log from '../Log';
import getAbsolutePath from '../utils/getAbsolutePath';
import processCommandParams from './processCommandParams';

export interface IParsedCommand {
  id: string;
  cmd: string[];
  cwd: string;
}

export default function getCommands(
  environment: IEnvironment,
  commandNames: string[],
  params?: string[][]
): IParsedCommand[] {
  const cmds: IParsedCommand[] = [];
  for (const cmdName of commandNames) {
    const cmd = getCommand(environment, cmdName, params);
    if (cmd) {
      cmds.push(cmd);
    }
  }
  return cmds;
}

function getCommand(environment: IEnvironment, cmdName: string, params?: string[][]): IParsedCommand | undefined {
  const template = environment.template;
  if (!template.commands[cmdName]) {
    Log.error(`Error: Command "${cmdName}" not found in template "${template.id}"`);
    return undefined;
  }

  let command = normalizeCommand(template.commands[cmdName]);
  command = processCommandParams(command, params);
  const cwd = command.cwd ? getAbsolutePath(command.cwd, environment.path) : environment.path;

  return {
    id: cmdName,
    cmd: command.cmd as string[],
    cwd
  };
}

function normalizeCommand(command: string | string[] | IConfigCommand): IConfigCommand {
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
  return command;
}
