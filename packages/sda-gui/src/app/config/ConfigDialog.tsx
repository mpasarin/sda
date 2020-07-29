import { ipcRenderer } from 'electron';
import { cloneDeep, merge, uniq } from 'lodash';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
} from 'office-ui-fabric-react';
import * as React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import HomeConfig from 'sda/lib/config/HomeConfig';
import { INamed } from 'sda/lib/interfaces';
import {
  IConfig,
  IConfigCommand,
  IConfigEnvironment,
  IConfigTemplate,
} from 'sda/lib/interfaces/IConfig';
import withId from 'sda/lib/interfaces/withId';
import { isArray, isString } from 'util';
import IState from '../redux/IState';
import EnvironmentEditor from './EnvironmentEditor';
import TemplateEditor from './TemplateEditor';

export interface IConfigDialogProps {
  config: IConfig; // use to double check if id already exists

  // Operation has to exist when showDialog is true
  operation?: IConfigOperation;
  showDialog: boolean;
  // closeDialog only exists when showDialog is true
  closeDialog?: () => void;
}

export interface IConfigOperation {
  envId: string; // environment we are dealing with
  action: 'new' | 'edit';
  target: 'env' | 'template';
}

export interface IEditableCommand {
  id: string;
  restriction?: string; // String with the warning why the command can't be modified
  hasChanged: boolean;
  cmd: string;
  cwd?: string;
  description?: string;
  timeout?: number;
  hasBeenRemoved?: boolean;
}

const ConfigDialog = (props: IConfigDialogProps) => {
  if (!props.showDialog || !props.operation) {
    return null;
  }

  const isNew = props.operation.action === 'new';
  const isEnv = props.operation.target === 'env';
  const envId = !isNew ? props.operation.envId : undefined;
  const [env, setEnv] = useState(
    !!envId
      ? cloneDeep(withId(envId, props.config.environments[envId]))
      : ({} as Partial<INamed<IConfigEnvironment>>)
  ); // tslint:disable-line: max-line-length
  const [template, setTemplate] = useState(
    !!envId
      ? cloneDeep(
          withId(env.templateId!, props.config.templates[env.templateId!])
        )
      : ({} as Partial<INamed<IConfigTemplate>>)
  ); // tslint:disable-line: max-line-length
  const [commands, setCommands] = useState(
    template ? getEditableCommands(template) : []
  );

  return (
    <Dialog
      hidden={!props.showDialog}
      onDismiss={props.closeDialog}
      dialogContentProps={{
        type: DialogType.normal,
        title: getTitle(props.operation, env, template),
      }}
      minWidth={600}
      modalProps={{
        isBlocking: false,
      }}
    >
      <div style={{ height: isEnv ? '200px' : '600px', overflowY: 'auto' }}>
        {isEnv ? (
          <EnvironmentEditor
            isNew={isNew}
            env={env}
            setEnv={setEnv}
            config={props.config}
          />
        ) : (
          // tslint:disable-next-line: max-line-length
          <TemplateEditor
            isNew={isNew}
            template={template}
            setTemplate={setTemplate}
            commands={commands}
            setCommands={setCommands}
            config={props.config}
          />
        )}
      </div>

      <DialogFooter>
        <PrimaryButton
          text='Save'
          disabled={
            isEnv
              ? !isEnvValid(env, props.config, isNew)
              : !isTemplateValid(template, commands, props.config, isNew)
          }
          onClick={() => {
            isEnv ? saveEnv(env) : saveTemplate(template, commands);
            props.closeDialog!();
          }}
        />
        <DefaultButton onClick={props.closeDialog} text='Cancel' />
      </DialogFooter>
    </Dialog>
  );
};

function getTitle(
  configOperation: IConfigOperation,
  env: Partial<INamed<IConfigEnvironment>>,
  template: Partial<INamed<IConfigTemplate>>
) {
  switch (configOperation.action) {
    case 'new':
      return configOperation.target === 'env'
        ? 'Create new environment'
        : 'Create new template';
    case 'edit':
      return configOperation.target === 'env'
        ? `Edit environment "${env.id}"`
        : `Edit template "${template.id}"`;
  }
}

function isEnvValid(
  env: Partial<INamed<IConfigEnvironment>>,
  config: IConfig,
  isNew: boolean
) {
  const hasProperties = !!env.id && !!env.path && !!env.templateId;
  // Check if the id is available for new components
  return (
    hasProperties && (!isNew || config.environments[env.id!] === undefined)
  );
}

function saveEnv(env: Partial<INamed<IConfigEnvironment>>) {
  const homeConfig = HomeConfig.create();
  homeConfig.addEnvironment(env as INamed<IConfigEnvironment>);
  homeConfig.write().then(() => ipcRenderer.send('request-update-config'));
}

function isTemplateValid(
  template: Partial<INamed<IConfigTemplate>>,
  commands: IEditableCommand[],
  config: IConfig,
  isNew: boolean
) {
  const hasProperties = !!template.id;
  // Check if the id is available for new components
  const isTemplateMetadataValid =
    hasProperties &&
    (!isNew || config.environments[template.id!] === undefined);
  if (!isTemplateMetadataValid) {
    return false;
  }

  // Check only commands that have changed - Disabled commands might actually be invalid
  const cmds = commands.filter((cmd) => cmd.hasChanged);
  const cmdIds = cmds.map((cmd) => cmd.id);
  // No duplicate command id
  if (cmdIds.length !== uniq(cmdIds).length) {
    return false;
  }

  // No spaces in ids, no starting with TODO
  if (
    cmdIds
      .map((id) => id.startsWith('TODO') || id.includes(' '))
      .reduce((v1, v2) => v1 || v2, false)
  ) {
    return false;
  }

  // All commands have a command to execute, no TODO
  if (
    cmds
      .map((cmd) => cmd.cmd)
      .map((cmd) => !cmd || cmd.startsWith('TODO'))
      .reduce((v1, v2) => v1 || v2, false)
  ) {
    return false;
  }

  return true;
}

function saveTemplate(
  template: Partial<INamed<IConfigTemplate>>,
  commands: IEditableCommand[]
) {
  template = setEditableCommands(template, commands);
  const homeConfig = HomeConfig.create();
  homeConfig.addTemplate(template as INamed<IConfigTemplate>);
  homeConfig.write().then(() => ipcRenderer.send('request-update-config'));
}

const ARRAY_RESTRICTION_MSG = 'Array commands are not supported';
const FILE_PATH_RESTRICTION_MSG = 'File path commands are not supported';
const PARAMS_RESTRICTION_MSG = 'Commands with parameters are not supported';

function getEditableCommands(
  template: Partial<INamed<IConfigTemplate>>
): IEditableCommand[] {
  if (!template.commands) {
    return [];
  }
  return Object.keys(template.commands).map((cmdId) => {
    const command = template.commands![cmdId];
    if (isString(command)) {
      return { id: cmdId, cmd: command, hasChanged: false };
    } else if (isArray(command)) {
      const cmdString = `[${command.join(', ')}]`;
      return {
        id: cmdId,
        cmd: cmdString,
        restriction: ARRAY_RESTRICTION_MSG,
        hasChanged: false,
      };
    } else if (isArray(command.cmd)) {
      const cmdString = `[${command.cmd.join(', ')}]`;
      return {
        id: cmdId,
        cmd: cmdString,
        restriction: ARRAY_RESTRICTION_MSG,
        hasChanged: false,
      };
    } else if (!!command.filePath) {
      return {
        id: cmdId,
        cmd: '',
        restriction: FILE_PATH_RESTRICTION_MSG,
        hasChanged: false,
      };
    } else if (!!command.validParams) {
      return {
        id: cmdId,
        cmd: '',
        restriction: PARAMS_RESTRICTION_MSG,
        hasChanged: false,
      };
    } else {
      return {
        id: cmdId,
        hasChanged: false,
        cmd: command.cmd as string,
        cwd: command.cwd,
        description: command.description,
        timeout: command.timeout ? parseInt(command.timeout, 10) : -1,
      };
    }
  });
}

function setEditableCommands(
  template: Partial<INamed<IConfigTemplate>>,
  commands: IEditableCommand[]
) {
  const cmds: { [id: string]: IConfigCommand } = {};
  commands.forEach((command) => {
    if (command.hasChanged) {
      cmds[command.id] = {
        cmd: command.cmd,
        cwd: command.cwd,
        description: command.description,
      };
    }
  });
  template.commands = merge(template.commands, cmds);
  commands.forEach((command) => {
    if (command.hasBeenRemoved) {
      template.commands![command.id] = undefined as any;
    }
  });
  return template;
}

function mapStateToProps(state: IState) {
  return {
    config: state.config,
  };
}

export default connect(mapStateToProps)(ConfigDialog);
