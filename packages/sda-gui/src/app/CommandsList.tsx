import { DefaultButton, IContextualMenuProps, List } from 'office-ui-fabric-react';
import * as React from 'react';
import { IEnvironment } from 'sda/lib/interfaces';
import { IConfigCommand } from 'sda/lib/interfaces/IConfig';
import exec from 'sda/lib/utils/exec';
import { IExtendedEnvironment } from './IExtendedEnvironment';

interface ICommandsListProps {
  env: IExtendedEnvironment;
}

interface ICommandItem {
  id: string;
  title: string;
  description?: string;
  execCommand: string;
  isRunning: boolean;
}

export default class CommandsList extends React.Component<ICommandsListProps> {
  private isRunningMap: Map<string, boolean>;

  constructor(props: ICommandsListProps, context: any) {
    super(props, context);
    this.onRenderCell = this.onRenderCell.bind(this);
    this.isRunningMap = new Map();
  }

  public render() {
    return <List items={this.getCommandItems(this.props.env)} onRenderCell={this.onRenderCell} />;
  }

  private getCommandItems(env: IEnvironment): ICommandItem[] {
    const cmdIds = Object.keys(env.template.commands);
    return cmdIds.map((id) => ({
      id: this.getItemId(env, id),
      title: id,
      description: (env.template.commands[id] as IConfigCommand).description,
      execCommand: `sda ${env.id} ${id}`,
      isRunning: !!this.isRunningMap.get(this.getItemId(env, id))
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
        <b>{item.title}</b> {item.description ? ` - ${item.description}` : ''}
      </p>
      <div style={{ flexShrink: 0 }}>
        <DefaultButton
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
    this.isRunningMap.set(item.id, true);
    this.forceUpdate(); // Updating the map updates the state
    const result = exec(item.execCommand);
    result.then(() => {
      this.isRunningMap.set(item.id, false);
      this.forceUpdate(); // Updating the map updates the state
    });
  }

  private getItemId(env: IExtendedEnvironment, commandId: string) {
    return `${env.id}__${commandId}`;
  }
}
