import { ipcRenderer } from 'electron';
import {
  CommandBar as FabricCommandBar,
  ICommandBarItemProps,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import HomeConfig from 'sda/lib/config/HomeConfig';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import ConfigDialog, { IConfigDialogProps } from './config/ConfigDialog';
import IState from './redux/IState';

interface ICommandBarProps {
  config: IConfig;
  selectedEnvId: string;
}

const CommandBar = (props: ICommandBarProps) => {
  const [dialogProps, setDialogProps] = useState({ showDialog: false } as Omit<
    IConfigDialogProps,
    'config'
  >);
  return (
    <>
      <FabricCommandBar items={getCommandBarItems(props, setDialogProps)} />
      <ConfigDialog {...dialogProps} />
    </>
  );
};

function getCommandBarItems(
  props: ICommandBarProps,
  setDialogProps: (dialogProps: Omit<IConfigDialogProps, 'config'>) => void
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
                operation: {
                  action: 'new',
                  target: 'env',
                  envId: props.selectedEnvId,
                },
                closeDialog,
              });
            },
          },
          {
            key: 'newTemplate',
            text: 'Template',
            onClick: () => {
              setDialogProps({
                showDialog: true,
                operation: {
                  action: 'new',
                  target: 'template',
                  envId: props.selectedEnvId,
                },
                closeDialog,
              });
            },
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
                operation: {
                  action: 'edit',
                  target: 'env',
                  envId: props.selectedEnvId,
                },
                closeDialog,
              });
            },
          },
          {
            key: 'editTemplate',
            text: 'Template',
            onClick: () => {
              setDialogProps({
                showDialog: true,
                operation: {
                  action: 'edit',
                  target: 'template',
                  envId: props.selectedEnvId,
                },
                closeDialog,
              });
            },
          },
        ],
      },
    },
    {
      key: 'delete',
      text: 'Delete',
      iconProps: { iconName: 'Delete' },
      subMenuProps: {
        items: [
          {
            key: 'deleteEnv',
            text: 'Environment',
            onClick: () => {
              const homeConfig = HomeConfig.create();
              homeConfig.removeEnvironment(props.selectedEnvId);
              homeConfig
                .write()
                .then(() => ipcRenderer.send('request-update-config'));
            },
          },
        ],
      },
    },
  ];
}

function mapStateToProps(state: IState) {
  return {
    config: state.config,
    selectedEnvId: state.selectedEnvId,
  };
}

export default connect(mapStateToProps)(CommandBar);
