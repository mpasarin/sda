import { DefaultButton, IContextualMenuProps, List } from 'office-ui-fabric-react';
import * as React from 'react';
import { IEnvironment } from 'sda/lib/interfaces';
import { IConfigCommand } from 'sda/lib/interfaces/IConfig';
import exec from 'sda/lib/utils/exec';
import { IExtendedEnvironment } from './IExtendedEnvironment';

interface ICommandsListProps {
    env: IExtendedEnvironment;
}

interface ICommandListState {
    isRunning: Map<string, boolean>;
}

interface ICommandItem {
    id: string;
    description?: string;
    execCommand: string;
    isRunning: boolean;
}

export default class CommandsList extends React.Component<ICommandsListProps, ICommandListState> {
    private commandItems: ICommandItem[];

    constructor(props: ICommandsListProps, context: any) {
        super(props, context);
        this.onRenderCell = this.onRenderCell.bind(this);
        this.commandItems = this.getCommandItems(this.props.env);
        const isRunningMap = new Map();
        this.commandItems.forEach((item) => isRunningMap.set(item.id, false));
        this.state = { isRunning: isRunningMap };
    }

    public render() {
        const items: ICommandItem[] =
            this.commandItems.map((item) => ({ ...item, isRunning: this.state.isRunning.get(item.id)! }));
        return <List items={items} onRenderCell={this.onRenderCell} />;
    }

    private getCommandItems(env: IEnvironment): ICommandItem[] {
        const cmdIds = Object.keys(env.template.commands);
        return cmdIds.map((id) => ({
            id,
            description: (env.template.commands[id] as IConfigCommand).description,
            execCommand: `sda ${env.id} ${id}`,
            isRunning: false
        }));
    }

    private onRenderCell(item?: ICommandItem) {
        if (!item) { return null; }

        const menuProps: IContextualMenuProps = {
            items: [{
                key: 'runInConsole',
                text: 'Run in console',
                iconProps: { iconName: 'CommandPrompt' }
            }],
            onItemClick: () => this.executeInConsole(item)
        };

        return (<div style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
            <p style={{ flexGrow: 1, marginLeft: '5px', marginRight: '5px' }}>
                <b>{item.id}</b> {item.description ? ` - ${item.description}` : ''}
            </p>
            <div>
                <DefaultButton
                    style={{ flexShrink: 0 }}
                    disabled={item.isRunning}
                    iconProps={item.isRunning ? { iconName: 'SyncStatus' } : { iconName: 'Play' }}
                    split
                    menuProps={menuProps}
                    text='Run command'
                    onClick={() => this.executeCommand(item)}
                />
            </div>
        </div>);
    }

    private executeInConsole(item: ICommandItem) {
        exec(`start ${item.execCommand}`);
    }

    private executeCommand(item: ICommandItem) {
        this.state.isRunning.set(item.id, true);
        this.forceUpdate(); // Updating the map updates the state
        const result = exec(item.execCommand);
        result.then(() => {
            this.state.isRunning.set(item.id, false);
            this.forceUpdate(); // Updating the map updates the state
        });
    }
}
