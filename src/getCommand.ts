import { ICommandDefinition, IEnvironmentDefinition } from './schema/ISemConfig';

export default function getCommand(def: IEnvironmentDefinition, cmdName: string): ICommandDefinition {
  let command = def.commands[cmdName];
  if (!command) {
    throw new Error(`Command "${cmdName}" does not exist`);
  }

  if (typeof command === 'string') {
    command = { cmd: command };
  }

  return command;
}
