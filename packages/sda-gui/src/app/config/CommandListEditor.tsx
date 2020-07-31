import { INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { INamed } from 'sda/lib/interfaces';
import { IConfig, IConfigTemplate } from 'sda/lib/interfaces/IConfig';
import CommandEditor from './CommandEditor';
import { IEditableCommand } from './ConfigDialog';
import getCommandDisplayId from './getCommandDisplayId';

const NEW_COMMAND_KEY = '__new';

type setTemplateType = React.Dispatch<
  React.SetStateAction<Partial<INamed<IConfigTemplate>>>
>;
type setCommandsType = React.Dispatch<React.SetStateAction<IEditableCommand[]>>;

interface ICommandListEditorProps {
  template: Partial<INamed<IConfigTemplate>>;
  setTemplate: setTemplateType;
  commands: IEditableCommand[];
  setCommands: setCommandsType;
  isNew: boolean;
  config: IConfig;
}

export default (props: ICommandListEditorProps) => {
  const commands = props.commands;
  const [selectedCmdId, setSelectedCmdId] = useState<string | undefined>(
    !!commands[0] ? commands[0].id : undefined
  );
  const [newCmdCounter, setNewCmdCounter] = useState<number>(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <Nav
        styles={{
          root: {
            height: '100%',
            width: '200px',
            overflowY: 'auto',
          },
        }}
        selectedKey={selectedCmdId}
        onLinkClick={(ev, item) => {
          if (item) {
            if (item.key === NEW_COMMAND_KEY) {
              const newCmd: IEditableCommand = {
                id: `New command ${newCmdCounter}`,
                cmd: '',
                hasChanged: true,
              };
              setNewCmdCounter(newCmdCounter + 1);
              props.setCommands((cmds) => [...cmds, newCmd]);
              setSelectedCmdId(newCmd.id);
            } else {
              setSelectedCmdId(item.key!);
            }
          }
        }}
        groups={[
          {
            links: getNavLinks(commands),
          },
        ]}
      />
      <div style={{ marginLeft: '10px', width: '100%' }}>
        {!!selectedCmdId ? (
          <CommandEditor
            command={commands.find((cmd) => cmd.id === selectedCmdId)!}
            setCommand={(cmd) =>
              setCommand(
                cmd,
                commands,
                props.setCommands,
                selectedCmdId,
                setSelectedCmdId
              )
            }
          />
        ) : null}
      </div>
    </div>
  );
};

function setCommand(
  command: IEditableCommand,
  commands: IEditableCommand[],
  setCommands: setCommandsType,
  selectedCmdId: string,
  setSelectedCmdId: (cmdId: string | undefined) => void
) {
  for (let i = 0; i < commands.length; i++) {
    if (commands[i].id === command.id) {
      commands[i] = command;
    }
  }
  // We are modifying the existing array in-place, so the setter just leaves it as is
  setCommands((cmds) => [...cmds]);
  const selectedCmd = commands.find((cmd) => cmd.id === selectedCmdId);
  if (selectedCmd && selectedCmd.hasBeenRemoved) {
    const firstNonRemovedCmd = commands.find((cmd) => !cmd.hasBeenRemoved);
    setSelectedCmdId(!!firstNonRemovedCmd ? firstNonRemovedCmd.id : undefined);
  }
}

function getNavLinks(commands: IEditableCommand[]): INavLink[] {
  const links: INavLink[] = [];

  links.push({
    name: 'New command',
    key: NEW_COMMAND_KEY,
    icon: 'Add',
    url: '',
  });

  commands.forEach((cmd) => {
    if (!cmd.hasBeenRemoved) {
      links.push({
        name: getCommandDisplayId(cmd),
        key: cmd.id,
        url: '',
      });
    }
  });

  return links;
}
