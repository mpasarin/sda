import { initializeIcons } from '@uifabric/icons';
import { Fabric, INavLink, Nav } from 'office-ui-fabric-react';
import * as React from 'react';
import { getEnvironment } from 'sda-core/lib/getEnvironment';
import { IEnvironment } from 'sda-core/lib/interfaces';
import { IConfig } from 'sda-core/lib/interfaces/IConfig';
import EnvironmentDashboard from './EnvironmentDashboard';

interface IMainComponentProps {
    config: IConfig;
}

interface IMainComponentState {
    env: IEnvironment | undefined;
}

export default class MainComponent extends React.Component<IMainComponentProps, IMainComponentState> {
    constructor(props: IMainComponentProps, context?: any) {
        super(props, context);
        const firstEnvId = Object.getOwnPropertyNames(this.props.config.environments)[0];
        const firstEnv = getEnvironment(this.props.config, firstEnvId);
        this.state = { env: firstEnv };
        initializeIcons();
    }

    public render() {
        return (
            <Fabric>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Nav
                        styles={{
                            root: {
                                minWidth: '150px'
                            }
                        }}
                        selectedKey={this.state.env ? this.state.env.id : undefined}
                        onLinkClick={
                            (ev, item) => {
                                if (item) {
                                    this.setState({ env: getEnvironment(this.props.config, item.name) });
                                }
                            }}
                        groups={
                            [
                                {
                                    links: this.getNavLinks(this.props.config)
                                }
                            ]
                        }
                    />
                    <EnvironmentDashboard env={this.state.env} />
                </div>
            </Fabric>
        );
    }

    private getNavLinks(config: IConfig): INavLink[] {
        const links: INavLink[] = [];
        const envs = config.environments;
        for (const envId in envs) {
            if (envs.hasOwnProperty(envId)) {
                links.push({
                    name: envId,
                    url: '',
                    key: envId
                });
            }
        }
        return links;
    }
}
