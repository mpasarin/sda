import { isArray, isString } from 'util';
import { ICommand, ITemplate } from './interfaces/IConfig';

export default function getCommand(def: ITemplate, cmdName: string): ICommand {
  let command = def.commands[cmdName];
  if (!command) {
    throw new Error(`Command "${cmdName}" does not exist`);
  }

  // Fix up shorthand for commands
  if (isString(command)) {
    command = { cmd: [command] };
  } else if (isArray(command)) {
    command = { cmd: command };
  }

  return command;
}
