
import * as path from 'path';
import { IEnvironmentDefinition, ISemConfig } from './schema/ISemConfig';

export default function getEnvironment(config: ISemConfig, currentDir: string, configDir: string): {
  def: IEnvironmentDefinition,
  name: string,
  path: string
} {
  for (const envName of Object.keys(config.environments)) {
    const env = config.environments[envName];

    const fullPath = path.resolve(configDir, env.path);
    const relativePath = path.relative(fullPath, currentDir);
    if (!relativePath || relativePath.indexOf('..') !== 0) { // We are in the environment root folder, or inside it
      if (!config.definitions[env.definition]) {
        throw new Error('Definition does not exist');
      }

      return {
        def: config.definitions[env.definition],
        name: envName,
        path: fullPath
      };
    }
  }

  throw new Error('Environment not found');
}
