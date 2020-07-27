import { initializeIcons } from '@uifabric/icons';
import { Fabric, INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getEnvironment } from 'sda/lib/getEnvironment';
import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import CommandBar from './CommandBar';
import EnvironmentDashboard from './EnvironmentDashboard';
import { IExtendedEnvironment } from './IExtendedEnvironment';
import { selectEnv, setBranchName } from './redux/actions';
import IState from './redux/IState';

// tslint:disable-next-line: no-var-requires
const git = require('gift');

interface IMainComponentProps {
  config: IConfig;
  selectedEnvId: string;
  branchNames: { [envId: string]: string };
  selectEnv: (envId: string) => void;
  setBranchName: (envId: string, branchName: string) => void;
}

export interface IGitInformation {
  branchName: string;
}
class MainComponent extends React.Component<IMainComponentProps> {
  private envs: Map<string, IExtendedEnvironment> = new Map();
  private timerId?: number;

  constructor(props: IMainComponentProps, context?: any) {
    super(props, context);
    this.initializeEnvs(this.props.config);
    initializeIcons();
  }

  public render() {
    return (
      <Fabric>
        <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
          <Nav
            styles={{
              root: {
                height: '100%',
                width: '200px',
              },
            }}
            selectedKey={this.props.selectedEnvId}
            onLinkClick={(ev, item) => {
              if (item) {
                this.props.selectEnv(item.key!);
              }
            }}
            groups={[
              {
                links: this.getNavLinks(),
              },
            ]}
          />
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <CommandBar
              config={this.props.config}
              selectedEnvId={this.props.selectedEnvId}
            />
            <EnvironmentDashboard
              env={this.envs.get(this.props.selectedEnvId)!}
            />
          </div>
        </div>
      </Fabric>
    );
  }

  public componentDidMount() {
    // Update the branch every 5 minutes - Changing branches is an unusual operation
    this.timerId = window.setInterval(() => this.initializeEnvs(this.props.config), 500000);
  }

  public componentWillUnmount() {
    clearInterval(this.timerId);
  }

  private async initializeEnvs(config: IConfig) {
    const promises = Object.keys(config.environments)
      .map((envId) => getEnvironment(config, envId))
      .map((env) => {
        // Set the environment without the branch first
        this.envs.set(env.id, env);
        if (!env.template.gitRepo) {
          return Promise.resolve();
        } else {
          return this.getBranchName(env).then((branchName) => {
            this.props.setBranchName(env.id, branchName);
            // Keeping it for now while I keep moving stuff around
            this.envs.set(env.id, { ...env, branchName });
          });
        }
      });
    return Promise.all(promises);
  }

  private getNavLinks(): INavLink[] {
    const links: INavLink[] = [];

    for (const envId of Object.keys(this.props.config.environments)) {
      links.push({
        name: this.props.branchNames[envId] ? `${envId} (${this.props.branchNames[envId]})` : envId,
        url: '',
        key: envId,
      });
    }
    return links;
  }

  private getBranchName(env: IEnvironment): Promise<string> {
    return new Promise((resolve, reject) => {
      const repo = git(env.path);
      repo.branch((err: Error, head: { name: string }) => {
        if (err) {
          reject(err);
        }
        resolve(head.name);
      });
    });
  }
}

function mapStateToProps(state: IState) {
  return {
    config: state.config,
    selectedEnvId: state.selectedEnvId,
    branchNames: state.branchNameByEnvId,
    lastBranchUpdate: state.lastBranchUpdate // Used to update the branch info when updated
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    selectEnv: (envId: string) => dispatch(selectEnv(envId)),
    setBranchName: (envId: string, branchName: string) =>
      dispatch(setBranchName(envId, branchName)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MainComponent);
