import { IEnvironment, ITemplate } from '../interfaces';
import { IConfig } from '../interfaces/IConfig';

export const template: ITemplate = {
  commands: {
    inlineCommand: 'inline',
    inlineArrayCommand: ['inline1', 'inline2'],
    regularCommand: {
      cmd: 'regular'
    },
    regularArrayCommand: {
      cmd: ['regular1', 'regular2']
    },
    commandWithFolder: {
      cmd: 'withFolder',
      cwd: 'C:\\'
    },
    commandWithFilePath: {
      filePath: 'someFilePath'
    }
  },
  id: 'testTemplate'
};

export const env: IEnvironment = {
  id: 'testEnv',
  path: '.',
  template,
  templateId: 'testTemplate',
};

export const config: IConfig = {
  templates: {
    testTemplate: template
  },
  environments: {
    testEnv: {
      path: 'C:\\folderA\\folderB',
      templateId: 'testTemplate'
    }
  }
};

export const badConfig: IConfig = {
  templates: {
    testTemplate: template
  },
  environments: {
    badEnv: {
      path: 'C:\\folderA\\folderB',
      templateId: 'badTemplate'
    }
  }
};