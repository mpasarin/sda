import { initializeIcons } from '@uifabric/icons';
import { Fabric, INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { IEnvironment } from 'sda/lib/interfaces';
import CommandBar from './CommandBar';
import EnvironmentDashboard from './EnvironmentDashboard';
import { selectEnv, setBranchName } from './redux/actions';
import IState from './redux/IState';

// tslint:disable-next-line: no-var-requires
const git = require('gift');

interface IMainComponentProps {
  envsById: { [envId: string]: IEnvironment };
  selectedEnvId: string;
  branchNames: { [envId: string]: string };
  selectEnv: (envId: string) => void;
  setBranchName: (envId: string, branchName: string) => void;
  numberOfCommandsRunning: number;
}

class MainComponent extends React.Component<IMainComponentProps> {
  private timerId?: number;

  constructor(props: IMainComponentProps, context?: any) {
    super(props, context);
    this.updateBranchNames(this.props.envsById);
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
            <CommandBar />
            <EnvironmentDashboard />
          </div>
        </div>
      </Fabric>
    );
  }

  public componentDidMount() {
    // Update the branch every 5 minutes - Changing branches is an unusual operation
    this.timerId = window.setInterval(
      () => this.updateBranchNames(this.props.envsById),
      500000
    );
  }

  public componentDidUpdate(prevProps: IMainComponentProps) {
    if (prevProps.numberOfCommandsRunning !== this.props.numberOfCommandsRunning ||
      prevProps.selectedEnvId !== this.props.selectedEnvId) {
        const selectedEnv = this.props.envsById[this.props.selectedEnvId];
        this.updateBranchName(selectedEnv);
      }
  }

  public componentWillUnmount() {
    clearInterval(this.timerId);
  }

  private async updateBranchNames(envsById: { [envId: string]: IEnvironment }) {
    const promises = Object.values(envsById).map(this.updateBranchName.bind(this));
  }

  private async updateBranchName(env: IEnvironment) {
    if (!env.template.gitRepo) {
      return Promise.resolve();
    } else {
      return this.getBranchName(env).then((branchName) => {
        this.props.setBranchName(env.id, branchName);
      });
    }
  }

  private getNavLinks() {
    const links: INavLink[] = [];

    for (const envId of Object.keys(this.props.envsById)) {
      links.push({
        name: this.props.branchNames[envId]
          ? `${envId} (${this.props.branchNames[envId]})`
          : envId,
        icon: this.props.envsById[envId].template.icon,
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
    envsById: state.envsById,
    selectedEnvId: state.selectedEnvId,
    branchNames: state.branchNameByEnvId,
    lastBranchUpdate: state.lastBranchUpdate, // Used to update the branch info when updated
    numberOfCommandsRunning: state.numberOfCommandsRunning,
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
