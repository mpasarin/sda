import { TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { INamed } from 'sda/lib/interfaces';
import { IConfig, IConfigTemplate } from 'sda/lib/interfaces/IConfig';
import CommandListEditor from './CommandListEditor';
import { IEditableCommand } from './ConfigDialog';

type setTemplateType = React.Dispatch<
  React.SetStateAction<Partial<INamed<IConfigTemplate>>>
>;
type setCommandsType = React.Dispatch<React.SetStateAction<IEditableCommand[]>>;

interface ITemplateEditorProps {
  template: Partial<INamed<IConfigTemplate>>;
  setTemplate: setTemplateType;
  commands: IEditableCommand[];
  setCommands: setCommandsType;
  isNew: boolean;
  config: IConfig;
}

export default (props: ITemplateEditorProps) => {
  const template = props.template;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '590px' }}>
      <TextField
        label='Template id'
        disabled={!props.isNew}
        defaultValue={template.id}
        onChange={(ev, value) => {
          props.setTemplate({ ...template, id: value });
        }}
      />
      <TextField
        label='Description'
        defaultValue={template.description}
        onChange={(ev, value) => {
          props.setTemplate({ ...template, description: value });
        }}
      />
      <TextField
        label='Git repository'
        defaultValue={template.gitRepo}
        onChange={(ev, value) => {
          props.setTemplate({ ...template, gitRepo: value });
        }}
      />
      <h3>Commands</h3>
      <div style={{ overflowY: 'hidden' }}>
        <CommandListEditor {...props} />;
      </div>
    </div>
  );
};
