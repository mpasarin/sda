import { CommandBar as FabricCommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import ConfigDialog, { IConfigDialogProps } from './config/ConfigDialog';
import IState from './redux/IState';

interface ICommandBarProps {
    config: IConfig;
    selectedEnvId: string;
}

const CommandBar = (props: ICommandBarProps) => {
    const [dialogProps, setDialogProps] = useState({ showDialog: false } as IConfigDialogProps);
    return <>
        <FabricCommandBar items={getCommandBarItems(props, setDialogProps)} />
        <ConfigDialog {...dialogProps} />
    </>;
};

function getCommandBarItems(
    props: ICommandBarProps,
    setDialogProps: (dialogProps: IConfigDialogProps) => void
): ICommandBarItemProps[] {
    const closeDialog = () => setDialogProps({ showDialog: false });
    return [
        {
            key: 'new',
            text: 'New',
            iconProps: { iconName: 'Add' },
            subMenuProps: {
                items: [
                    {
                        key: 'newEnv',
                        text: 'Environment',
                        onClick: () => {
                            setDialogProps({
                                showDialog: true,
                                action: 'new',
                                target: 'env',
                                config: props.config,
                                envId: props.selectedEnvId,
                                closeDialog
                            });
                        }
                    },
                    {
                        key: 'newTemplate',
                        text: 'Template',
                        onClick: () => {
                            setDialogProps({
                                showDialog: true,
                                action: 'new',
                                target: 'template',
                                config: props.config,
                                envId: props.selectedEnvId,
                                closeDialog
                            });
                        }
                    },
                ],
            },
        },
        {
            key: 'edit',
            text: 'Edit',
            iconProps: { iconName: 'Edit' },
            subMenuProps: {
                items: [
                    {
                        key: 'editEnv',
                        text: 'Environment',
                        onClick: () => {
                            setDialogProps({
                                showDialog: true,
                                action: 'edit',
                                target: 'env',
                                config: props.config,
                                envId: props.selectedEnvId,
                                closeDialog
                            });
                        }
                    },
                    {
                        key: 'editTemplate',
                        text: 'Template',
                        onClick: () => {
                            setDialogProps({
                                showDialog: true,
                                action: 'edit',
                                target: 'template',
                                config: props.config,
                                envId: props.selectedEnvId,
                                closeDialog
                            });
                        }
                    },
                ],
            },
        }
    ];
}

function mapStateToProps(state: IState) {
  return {
    config: state.config,
    selectedEnvId: state.selectedEnvId
  };
}

export default connect(mapStateToProps)(CommandBar);
