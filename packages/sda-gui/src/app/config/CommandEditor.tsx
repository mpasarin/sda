import { DefaultButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { IEditableCommand } from './ConfigDialog';
import getCommandDisplayId from './getCommandDisplayId';

interface ICommandEditorProps {
  command: IEditableCommand;
  setCommand: (command: IEditableCommand) => void;
}

export default (props: ICommandEditorProps) => {
  const { command, setCommand } = props;
  return (
    <div key={'div-command-editor'}>
      <TextField
        key={`textField-id-${command.id}`}
        label='Id'
        disabled={!!command.restriction}
        defaultValue={getCommandDisplayId(command)}
        onChange={(ev, value) => {
          command.newId = value || '';
          command.hasChanged = true;
          setCommand(command);
        }}
        onGetErrorMessage={(text) => {
          if (!text) {
            return 'Id must not be empty';
          }
          if (text.startsWith('TODO')) {
            return 'Id must not start with TODO';
          }
          if (text.includes(' ')) {
            return 'Id must not have white space';
          }
          return '';
        }}
      />
      <TextField
        key={`textField-desc-${command.id}`}
        label='Description'
        disabled={!!command.restriction}
        defaultValue={command.description}
        onChange={(ev, value) => {
          command.description = value;
          command.hasChanged = true;
          setCommand(command);
        }}
      />
      <TextField
        key={`textField-cmd-${command.id}`}
        label='Command'
        disabled={!!command.restriction}
        defaultValue={command.cmd}
        onChange={(ev, value) => {
          command.cmd = value || '';
          command.hasChanged = true;
          setCommand(command);
        }}
        onGetErrorMessage={(text) => {
          if (!text) {
            return 'Command must not be empty';
          }
          if (text.startsWith('TODO')) {
            return 'Command must not start with TODO';
          }
          return '';
        }}
      />
      <TextField
        key={`textField-cwd-${command.id}`}
        label='Working directory (relative to environment root)'
        disabled={!!command.restriction}
        defaultValue={command.cwd}
        onChange={(ev, value) => {
          command.cwd = value;
          command.hasChanged = true;
          setCommand(command);
        }}
      />
      <TextField
        key={`textField-icon-${command.id}`}
        label='Icon name'
        disabled={!!command.restriction}
        defaultValue={command.icon}
        onChange={(ev, value) => {
          command.icon = value;
          command.hasChanged = true;
          setCommand(command);
        }}
      />
      <DefaultButton
        style={{ width: '100%', marginTop: '15px' }}
        key={`button-removeCmd-${command.id}`}
        text={`Remove command "${getCommandDisplayId(command)}"`}
        disabled={!!command.restriction}
        onClick={() => {
          command.hasBeenRemoved = true;
          setCommand(command);
        }}
      />
    </div>
  );
};
