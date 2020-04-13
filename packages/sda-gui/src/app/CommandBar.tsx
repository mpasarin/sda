import { CommandBar, ICommandBarItemProps } from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import ConfigDialog, { IConfigDialogProps } from './config/ConfigDialog';

interface ICommandBarProps {
    config: IConfig;
    selectedEnvId: string;
}

export default (props: ICommandBarProps) => {
    const [dialogProps, setDialogProps] = useState({ showDialog: false } as IConfigDialogProps);
    return <>
        <CommandBar items={getCommandBarItems(props, setDialogProps)} />
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
