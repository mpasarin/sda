import { DefaultButton, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { INamed } from 'sda/lib/interfaces';
import { IConfig, IConfigTemplate } from 'sda/lib/interfaces/IConfig';
import { IEditableCommand } from './ConfigDialog';

type setTemplateType = React.Dispatch<React.SetStateAction<Partial<INamed<IConfigTemplate>>>>;
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
    const commands = props.commands;
    const [openCommandId, setOpenCommandId] = useState<string | undefined>(undefined);

    return <div>
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
        {
            commands.map(
                (cmd) => renderCommand(cmd, openCommandId === cmd.id, props.setCommands, setOpenCommandId)
            )
        }
        {renderAddCommand(props.setCommands, setOpenCommandId)}
    </div>;
};

function renderCommand(
    command: IEditableCommand,
    isOpen: boolean,
    setCommands: setCommandsType,
    setOpenCommandId: (id?: string) => void
) {
    return <div key={`div-${command.id}`}>
        <DefaultButton
            key={`button-${command.id}`}
            text={isOpen ? `Hide "${command.id}"` : `Show "${command.id}"`}
            onClick={() => setOpenCommandId(!isOpen ? command.id : undefined)}
        />
        {isOpen
            ? <div key={`div-expanded-${command.id}`}>
                <TextField
                    key={`textField-id-${command.id}`}
                    label='Id'
                    disabled={!!command.restriction}
                    defaultValue={command.id}
                    onChange={(ev, value) => {
                        command.id = value || '';
                        command.hasChanged = true;
                        setCommands((cmds) => [...cmds]);
                        setOpenCommandId(command.id);
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
                        setCommands((cmds) => [...cmds]);
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
                        setCommands((cmds) => [...cmds]);
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
                        setCommands((cmds) => [...cmds]);
                    }}
                />
                <hr />
            </div>
            : null
        }
    </div>;
}

function renderAddCommand(setCommands: setCommandsType, setOpenCommandId: (id: string) => void) {
    return <DefaultButton
        text={'Add new command'}
        onClick={() => {
            const newCmd: IEditableCommand = {
                id: 'TODO: Write the command id',
                hasChanged: true,
                cmd: 'TODO: Write the command to execute'
            };
            setOpenCommandId(newCmd.id);
            setCommands((cmds) => [...cmds, newCmd]);
        }}
    />;
}
