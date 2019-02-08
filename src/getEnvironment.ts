
import * as path from 'path';
import { IConfig, ITemplate } from './interfaces/IConfig';

export default function getEnvironment(config: IConfig, currentDir: string): {
  def: ITemplate,
  name: string,
  path: string
} {
  for (const envName of Object.keys(config.environments)) {
    const env = config.environments[envName];

    const envPath = env.path;
    const relativePath = path.relative(envPath, currentDir);
    if (!relativePath || relativePath.indexOf('..') !== 0) { // We are in the environment root folder, or inside it
      if (!config.templates[env.template]) {
        throw new Error('Definition does not exist');
      }

      return {
        def: config.templates[env.template],
        name: envName,
        path: envPath
      };
    }
  }

  throw new Error('Environment not found');
}
