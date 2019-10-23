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
    commandWithAbsoluteFolder: {
      cmd: 'withFolder',
      cwd: 'C:\\testX\\testY'
    },
    commandWithRelativeFolder: {
      cmd: 'withFolder',
      cwd: 'test1\\test2'
    },
    commandWithFilePath: {
      filePath: 'someFilePath'
    },
    commandWithFilePathAndInterpreter: {
      filePath: 'someFilePath',
      interpreter: 'node'
    },
    commandWithParams: {
      cmd: 'withParams',
      validParams: ['-param']
    },
    commandWithParamsPlaceholder: {
      cmd: 'withParams %PARAM% && anotherCommand',
      validParams: ['/p']
    }
  },
  id: 'testTemplate'
};

export const env: IEnvironment = {
  id: 'testEnv',
  path: 'C:\\folderA\\folderB',
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
