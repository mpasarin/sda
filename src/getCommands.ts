import { isArray, isString } from 'util';
import { IEnvironment, ITemplate } from './interfaces';
import { IConfigCommand } from './interfaces/IConfig';
import Log from './Log';

export interface IParsedCommand {
  id: string;
  cmd: string[];
  cwd?: string;
}

export default function getCommands(
  environment: IEnvironment,
  commandNames: string[],
  params?: string[][]
): IParsedCommand[] {
  const cmds: IParsedCommand[] = [];
  for (const cmdName of commandNames) {
    const cmd = getCommand(environment.template, cmdName, params);
    if (cmd) {
      cmds.push(cmd);
    }
  }
  return cmds;
}

function getCommand(template: ITemplate, cmdName: string, params?: string[][]): IParsedCommand | undefined {
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

  const paramString = params ? getParamString(command, params) : '';
  if (paramString.length > 0 && isArray(command.cmd)) {
    for (let i = 0; i < command.cmd.length; i++) {
      command.cmd[i] = addParams(command.cmd[i], paramString);
    }
  }

  return {
    id: cmdName,
    cmd: command.cmd as string[],
    cwd: command.cwd
  };
}
/**
 * Finds all valid params for the specified command and concatenates them as a string
 * @param command
 * @param params
 */
function getParamString(command: IConfigCommand, params: string[][]): string {
  if (!command.validParams || command.validParams.length === 0) {
    return '';
  }
  let paramString = '';
  for (const param of params) {
    if (command.validParams.indexOf(param[0]) > -1) {
      paramString += ' ' + param.join(' ');
    }
  }

  return paramString.trim();
}

/**
 * Adds parameter string to the command
 * If placeholder exists, add param string there. Otherwise, add to end.
 * @param cmd
 * @param paramString
 */
function addParams(cmd: string, paramString: string) {
  if (cmd.indexOf('%PARAM%') > -1) {
    return cmd.replace('%PARAM%', paramString);
  }
  return cmd + ' ' + paramString;
}
