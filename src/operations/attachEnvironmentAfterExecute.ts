import * as fs from 'fs';
import * as path from 'path';
import addEnvironmentToHomeConfigFile from '../config/addEnvironmentToHomeConfig';
import ExecutionConfig from '../ExecutionConfig';
import { ITemplate } from '../interfaces';
import { IConfig } from '../interfaces/IConfig';
import withId from '../interfaces/withId';
import Log from '../Log';

export interface IEnvOpParams {
  template: ITemplate;
  path: string;
}

export default function attachEnvironmentAfterExecute(ec: ExecutionConfig, func: (params: IEnvOpParams) => void) {
  const params = validateParams(ec);
  const envId = getEnvId(ec.config, params.template.id);

  ec.env = {
    id: envId,
    path: params.path,
    templateId: params.template.id,
    template: params.template
  };

  func(params);

  addEnvironmentToHomeConfigFile(ec.env);
}

/**
 * Throws if the params are not valid.
 * Returns the validated params with normalized path if they are valid.
 */
function validateParams(ec: ExecutionConfig): IEnvOpParams {
  const setupParameters = ec.setupParameters;
  if (!setupParameters) {
    throw new Error('No parameters passed for the operation.');
  }

  const destinationPath = getDestinationPath(setupParameters.path);
  if (!fs.existsSync(destinationPath)) {
    Log.verbose(`Creating missing directory "${destinationPath}"`);
    fs.mkdirSync(destinationPath);
  }

  if (!ec.config.templates[setupParameters.templateId]) {
    throw new Error(`Template "${setupParameters.templateId}" doesn't exist.`);
  }
  const template = withId(setupParameters.templateId, ec.config.templates[setupParameters.templateId]);
  return {
    template,
    path: destinationPath
  };
}

/**
 * Returns the destination path for the new environment in a normalized way.
 * If defined it makes it absolute, otherwise it uses the current path.
 */
function getDestinationPath(inputPath?: string): string {
  const currentDir = path.normalize(process.cwd());
  if (!inputPath) {
    return currentDir;
  }

  if (path.isAbsolute(inputPath)) {
    return path.normalize(inputPath);
  } else {
    return path.normalize(path.join(currentDir, inputPath));
  }
}

/**
 * Returns an environment id.
 * It's either the same as the template id, or if that is used, the first available
 * name "<templateId>-<number>".
 */
function getEnvId(config: IConfig, templateId: string): string {
  if (!config.environments[templateId]) {
    return templateId;
  }

  let i = 0;
  while (config.environments[`${templateId}-${i}`]) { i++; }
  return `${templateId}-${i}`;
}
