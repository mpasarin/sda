
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import { IConfig } from './interfaces/IConfig';

const configFileName = '.sdaconfig';

export default function getConfig(rootDir: string): IConfig {
  const paths = findConfigFilePaths(rootDir);
  const config = generateConfigFile(paths);
  return config;
}

function generateConfigFile(filePaths: string[]): IConfig {
  const combinedConfig: IConfig = {
    environments: {},
    templates: {}
  }; // Empty config
  for (const filePath of filePaths) {
    const configFile = fs.readFileSync(filePath, 'utf8');
    try {
      const config: IConfig = JSON.parse(configFile);
      _.merge(combinedConfig, replaceWithAbsolutePaths(config, filePath));
    } catch (error) {
      console.log(`WARNING: File "${filePath}" is invalid.`);
    }
  }

  return combinedConfig;
}

function replaceWithAbsolutePaths(config: Partial<IConfig>, configFilePath: string): Partial<IConfig> {
  if (config.environments) {
    const dir = path.parse(configFilePath).dir;
    for (const key of Object.keys(config.environments)) {
      const env = config.environments[key];
      env.path = path.join(dir, env.path);
    }
  }
  return config;
}

/**
 * Find all configuration files from the input folder path up to the root folder.
 * @param dir - Directory to start browsing up
 */
function findConfigFilePaths(dir: string): string[] {
  const paths: string[] = [];

  dir = path.normalize(dir);
  const root: string = path.parse(dir).root;
  do {
    const fileName = path.join(dir, configFileName);
    if (fs.existsSync(fileName)) {
      paths.push(fileName);
    }
    dir = path.normalize(path.join(dir, '..'));
  } while (dir !== root);

  return paths;
}
