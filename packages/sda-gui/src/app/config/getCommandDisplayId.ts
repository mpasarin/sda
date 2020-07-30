import { IEditableCommand } from './ConfigDialog';

export default function getCommandDisplayId(command: IEditableCommand) {
  return command.newId || command.id;
}
