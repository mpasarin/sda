import { exec } from 'child_process';
import { Icon, Link } from 'office-ui-fabric-react';
import * as React from 'react';
import CommandsList from './CommandsList';
import { IExtendedEnvironment } from './IExtendedEnvironment';

interface IEnvironmentDashboardProps {
  env: IExtendedEnvironment;
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
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <h1 style={{ margin: '20px', fontSize: '2.5em' }}>{env.id}</h1>
        </div>
        <div>
          <ul style={{ listStyle: 'none' }}>
            <li>Template: {env.templateId}</li>
            <li><Link href='#' onClick={() => exec(`start ${env.path}`)}>
              <Icon iconName='FolderHorizontal' /> {env.path}
            </Link></li>
            {env.template.gitRepo
              ? (<div>
                <li><Link href='#' onClick={() => exec(`start ${env.template.gitRepo}`)}>
                  <Icon iconName='GitGraph' /> {env.template.gitRepo}
                </Link></li>
                {env.branchName ? <li>Branch: {env.branchName}</li> : undefined}
              </div>)
              : null}
          </ul>
        </div>
      </div>
      <hr />
      <h2>Commands</h2>
      <CommandsList env={env} />
    </div>);
  }
}
