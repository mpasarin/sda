import { initializeIcons } from '@uifabric/icons';
import { Fabric, INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';
import { getEnvironment } from 'sda-core/lib/getEnvironment';
import { IEnvironment } from 'sda-core/lib/interfaces';
import { IConfig } from 'sda-core/lib/interfaces/IConfig';
import EnvironmentDashboard from './EnvironmentDashboard';
import { IExtendedEnvironment } from './IExtendedEnvironment';

// tslint:disable-next-line: no-var-requires
const git = require('gift');

interface IMainComponentProps {
    config: IConfig;
}

interface IMainComponentState {
    selectedEnvId: string;
}

export interface IGitInformation {
    branchName: string;
}

export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {

    private envs: Map<string, IExtendedEnvironment> = new Map();
    private initPromise: Promise<unknown>;

    constructor(props: IMainComponentProps, context?: any) {
        super(props, context);
        this.initPromise = this.initializeEnvs(this.props.config);
        const firstEnvId: string = this.envs.keys().next().value;
        this.state = { selectedEnvId: firstEnvId };
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
                                width: '200px'
                            }
                        }}
                        selectedKey={this.state.selectedEnvId}
                        onLinkClick={
                            (ev, item) => {
                                if (item) {
                                    this.setState({ selectedEnvId: item.key! });
                                }
                            }}
                        groups={
                            [
                                {
                                    links: this.getNavLinks(this.envs)
                                }
                            ]
                        }
                    />
                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                        <EnvironmentDashboard env={this.envs.get(this.state.selectedEnvId)!} />
                    </div>
                </div>
            </Fabric>
        );
    }

    public componentDidMount() {
        // Once branches are ready, re-render
        this.initPromise.then(() => this.forceUpdate());
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
                        this.envs.set(env.id, { ...env, branchName });
                    });
                }
            });
        return Promise.all(promises);
    }

    private getNavLinks(envs: Map<string, IExtendedEnvironment>): INavLink[] {
        const links: INavLink[] = [];
        for (const env of envs.values()) {
            links.push({
                name: env.branchName ? `${env.id} (${env.branchName})` : env.id,
                url: '',
                key: env.id
            });
        }
        return links;
    }

    private getBranchName(env: IEnvironment): Promise<string> {
        return new Promise((resolve, reject) => {
            const repo = git(env.path);
            repo.branch((err: Error, head: { name: string; }) => {
                if (err) { reject(err); }
                resolve(head.name);
            });
        });
    }
}
