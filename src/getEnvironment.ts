
import * as path from 'path';
import { IEnvironment, INamed } from './interfaces';
import { IConfig, IConfigEnvironment, IConfigTemplate } from './interfaces/IConfig';
import withId from './interfaces/withId';
import Log from './Log';

export function getEnvironment(config: IConfig, envId: string, currentDir?: string): IEnvironment {
  let environment: INamed<IConfigEnvironment> | undefined;
  if (config.environments[envId]) {
    environment = withId(envId, config.environments[envId]);
  }

  // Find environments from the current path
  if (!environment && currentDir) {
    for (const currentEnvName of Object.keys(config.environments)) {
      const currentEnv = config.environments[currentEnvName];
      const relativePath = path.relative(currentEnv.path, currentDir);
      if (!relativePath || relativePath.indexOf('..') !== 0) { // We are in the environment root folder, or inside it
        environment = withId(currentEnvName, currentEnv);
        Log.verbose(`Using environment "${environment.id}" from current folder.`);
        break;
      }
    }
  }

  if (!environment) {
    // tslint:disable-next-line:max-line-length
    throw new Error('Environment not found. Make sure to run sda inside of the environment, or pass the environment id');
  }

  if (!config.templates[environment.templateId]) {
    throw new Error(`There is no template with id "${environment.templateId}"`);
  }

  addDefaultCommands(environment, config);

  return {
    ...environment,
    template: withId(environment.templateId, config.templates[environment.templateId])
  };
}

export function getAllEnvironments(config: IConfig): IEnvironment[] {
  const envs: IEnvironment[] = [];
  Object.keys(config.environments).forEach((envId) => {
    const env = withId(envId, config.environments[envId]);
    addDefaultCommands(env, config);
    envs.push({
      ...env,
      template: withId(env.templateId, config.templates[env.templateId])
    });
  });
  return envs;
}

function addDefaultCommands(environment: IConfigEnvironment, config: IConfig): void {
  const defaultTemplate: IConfigTemplate | undefined = config.templates.default;
  const envTemplate = config.templates[environment.templateId];
  if (defaultTemplate) {
    Object.keys(defaultTemplate.commands).forEach((commandName) => {
      if (!envTemplate.commands[commandName]) {
        envTemplate.commands[commandName] = defaultTemplate.commands[commandName];
      }
    });
  }
}
