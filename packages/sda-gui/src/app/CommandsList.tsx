import { DefaultButton, IContextualMenuProps, List, TooltipHost } from 'office-ui-fabric-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IEnvironment } from 'sda/lib/interfaces';
import { IConfigCommand } from 'sda/lib/interfaces/IConfig';
import exec from 'sda/lib/utils/exec';
import { IExtendedEnvironment } from './IExtendedEnvironment';
import { endCommand, startCommand } from './redux/actions';
import IState from './redux/IState';

interface ICommandsListProps {
  env: IEnvironment;
  commandsRunning: { [cmdId: string]: boolean };
  startCommand: (cmdId: string) => void;
  endCommand: (cmdId: string) => void;
}

interface ICommandItem {
  id: string;
  title: string;
  description?: string;
  execCommand: string;
  isRunning: boolean;
}

class CommandsList extends React.Component<ICommandsListProps> {
  constructor(props: ICommandsListProps, context: any) {
    super(props, context);
    this.onRenderCell = this.onRenderCell.bind(this);
  }

  public render() {
    const items = this.getCommandItems(this.props.env);
    return <List
      items={items}
      getPageSpecification={() => ({
        itemCount: items.length
      })}
      onRenderCell={this.onRenderCell} />;
  }

  private getCommandItems(env: IEnvironment): ICommandItem[] {
    const cmdIds = Object.keys(env.template.commands);
    return cmdIds.map((id) => ({
      id: this.getItemId(env, id),
      title: id,
      description: (env.template.commands[id] as IConfigCommand).description,
      execCommand: env.id === 'all' ? `sda -a ${id}` : `sda ${env.id} ${id}`,
      isRunning: !!this.props.commandsRunning[this.getItemId(env, id)]
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
    return (
      <div style={{ float: 'left', marginRight: '15px', marginBottom: '15px' }}>
        <TooltipHost
          content={item.description}
          id={`tooltip_${item.id}`}
          styles={{ root: { display: 'inline-block' } }}
        >
          <DefaultButton
            style={{ width: '200px' }}
            disabled={item.isRunning}
            iconProps={item.isRunning ? { iconName: 'SyncStatus' } : { iconName: 'Play' }}
            split
            menuProps={menuProps}
            text={`Run "${item.title}"`}
            onClick={() => this.executeCommand(item)}
          />
        </TooltipHost>
      </div>);
  }

  private executeInConsole(item: ICommandItem) {
    exec(`start ${item.execCommand}`);
  }

  private executeCommand(item: ICommandItem) {
    this.props.startCommand(item.id);
    const result = exec(item.execCommand);
    result.then(() => {
      this.props.endCommand(item.id);
    });
  }

  private getItemId(env: IExtendedEnvironment, commandId: string) {
    return `${env.id}__${commandId}`;
  }
}

function mapStateToProps(state: IState) {
  return {
    env: state.envsById[state.selectedEnvId],
    commandsRunning: state.commandsRunning,
    numberOfCommandsRunning: state.numberOfCommandsRunning
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    startCommand: (cmdId: string) => dispatch(startCommand(cmdId)),
    endCommand: (cmdId: string) => dispatch(endCommand(cmdId))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CommandsList);
