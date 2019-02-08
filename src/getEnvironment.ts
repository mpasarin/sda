
import * as path from 'path';
import { IConfig, IEnvironmentDefinition } from './interfaces/IConfig';

export default function getEnvironment(config: IConfig, currentDir: string): {
  def: IEnvironmentDefinition,
  name: string,
  path: string
} {
  for (const envName of Object.keys(config.environments)) {
    const env = config.environments[envName];

    const envPath = env.path;
    const relativePath = path.relative(envPath, currentDir);
    if (!relativePath || relativePath.indexOf('..') !== 0) { // We are in the environment root folder, or inside it
      if (!config.definitions[env.definition]) {
        throw new Error('Definition does not exist');
      }

      return {
        def: config.definitions[env.definition],
        name: envName,
        path: envPath
      };
    }
  }

  throw new Error('Environment not found');
}
