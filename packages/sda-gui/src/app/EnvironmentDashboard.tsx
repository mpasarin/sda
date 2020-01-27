import { exec } from 'child_process';
import { DefaultButton, Icon, Link, List } from 'office-ui-fabric-react';
import * as React from 'react';
import { IEnvironment } from 'sda-core/lib/interfaces';
import { IConfigCommand } from 'sda-core/lib/interfaces/IConfig';

interface IEnvironmentDashboardProps {
  env?: IEnvironment;
}

interface ICommandItem {
  id: string;
  description?: string;
  execCommand: string;
}

export default class EnvironmentDashboard extends React.Component<IEnvironmentDashboardProps> {
  public render() {
    if (!this.props.env) { return null; }
    const env = this.props.env;
    return (<div style={{ margin: '10px', flexGrow: 1 }}>
      <h1>{env.id} ({env.templateId})</h1>
      <ul style={{ listStyle: 'none' }}>
        <li><Link href='#' onClick={() => exec(`start ${env.path}`)}>
          <Icon iconName='FolderHorizontal' /> {env.path}
        </Link></li>
        {env.template.gitRepo
          ? <li><Link href='#' onClick={() => exec(`start ${env.template.gitRepo}`)}>
            <Icon iconName='GitGraph' /> {env.template.gitRepo}
          </Link></li>
          : null}
      </ul>
      <hr />
      <h2>Commands</h2>
      <List items={this.getCommandItems(env)} onRenderCell={this.onRenderCell} />
    </div>);
  }

  private getCommandItems(env: IEnvironment): ICommandItem[] {
    const cmdIds = Object.keys(env.template.commands);
    return cmdIds.map((id) => ({
      id,
      description: (env.template.commands[id] as IConfigCommand).description,
      execCommand: `sda ${env.id} ${id}`
    }));
  }

  private onRenderCell(item?: ICommandItem) {
    if (!item) { return null; }
    return (<div style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
      <p style={{ flexGrow: 1, marginLeft: '5px', marginRight: '5px' }}>
        <b>{item.id}</b> {item.description ? ` - ${item.description}` : ''}
      </p>
      <DefaultButton text='Run command' onClick={() => exec(item.execCommand)} />
    </div>);
  }
}
