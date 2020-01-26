import { isArray, isString } from 'util';
import { IEnvironment } from '../interfaces';
import { IConfigCommand, IConfigTemplate } from '../interfaces/IConfig';
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
  const commandName = getCommandName(cmdName, template);
  if (!commandName) {
    Log.error(`Command "${cmdName}" not found in template "${template.id}"`);
    return undefined;
  }

  let command = normalizeCommand(template.commands[commandName]);
  command = processCommandParams(command, params);
  const cwd = command.cwd ? getAbsolutePath(command.cwd, environment.path) : environment.path;

  return {
    id: commandName,
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
    let filePath = `"${command.filePath}"`;
    if (isString(command.interpreter)) {
      if (command.interpreter === 'powershell') {
        filePath = `${command.interpreter} -File ${filePath}`;
      } else {
        filePath = `${command.interpreter} ${filePath}`;
      }
    }
    command.cmd = [filePath];
  }
  return command;
}

function getCommandName(commandName: string, template: IConfigTemplate): string {
  if (template.commands[commandName]) {
    return commandName;
  }
  if (template.aliases && template.aliases[commandName] && template.commands[template.aliases[commandName]] ) {
    return template.aliases[commandName];
  }
  return '';
}
