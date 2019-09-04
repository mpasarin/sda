
import * as path from 'path';
import { IEnvironment, INamed } from './interfaces';
import { IConfig, IConfigEnvironment } from './interfaces/IConfig';
import withId from './interfaces/withId';

export function getEnvironment(config: IConfig, currentDir: string, args: string[]): IEnvironment {
  let environment: INamed<IConfigEnvironment> | undefined;
  // Find environment as the first argument
  const arg = args[0];
  if (config.environments[arg]) {
    environment = withId(arg, config.environments[arg]);
  }

  // Find environments from the current path
  if (!environment) {
    for (const currentEnvName of Object.keys(config.environments)) {
      const currentEnv = config.environments[currentEnvName];
      const relativePath = path.relative(currentEnv.path, currentDir);
      if (!relativePath || relativePath.indexOf('..') !== 0) { // We are in the environment root folder, or inside it
        environment = withId(currentEnvName, currentEnv);
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

  // add default commands
  if (config.templates.default) {
    Object.keys(config.templates.default.commands).forEach((commandName) => {
      if (environment && !config.templates[environment.templateId].commands[commandName]) {
        config.templates[environment.templateId].commands[commandName] = config.templates.default.commands[commandName];
      }
    });
  }

  return {
    ...environment,
    template: withId(environment.templateId, config.templates[environment.templateId])
  };
}

export function getAllEnvironments(config: IConfig): IEnvironment[] {
  const envs: IEnvironment[] = [];
  Object.keys(config.environments).forEach((envId) => {
    const env = withId(envId, config.environments[envId]);

    // add default commands
    if (config.templates.default) {
      Object.keys(config.templates.default.commands).forEach((commandName) => {
        if (!config.templates[env.templateId].commands[commandName]) {
          config.templates[env.templateId].commands[commandName] = config.templates.default.commands[commandName];
        }
      });
    }

    envs.push({
      ...env,
      template: withId(env.templateId, config.templates[env.templateId])
    });
  });
  return envs;
}
