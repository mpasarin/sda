
import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';
import { IConfig } from '../interfaces/IConfig';
import Log from '../Log';
import getConfigPaths from './getConfigPaths';
import warnOldConfigFilePaths from './warnOldConfigFilePaths';

export const configFileName = 'sdaconfig.json';

export default function getConfig(rootDir: string, argsConfigPath?: string): IConfig {
  // Warn about old config file name for backwards compatibility
  warnOldConfigFilePaths(rootDir);

  const paths = getConfigPaths(rootDir);
  // If a config path is passed as arguments, merge it last
  if (argsConfigPath) {
    paths.push(argsConfigPath);
  }

  const config = generateConfigFile(paths);

  return config;
}

/**
 * Creates an IConfig object merging all the config files.
 */
function generateConfigFile(filePaths: string[]): IConfig {
  let combinedConfig: IConfig = {
    environments: {},
    templates: {}
  }; // Empty config
  for (const filePath of filePaths) {
    combinedConfig = mergeConfig(combinedConfig, filePath);
  }
  return combinedConfig;
}

/**
 * Merges the contents of a config file with an IConfig object.
 * In case of conflicts, the contents of the config file are used.
 */
function mergeConfig(config: IConfig, filePath: string): IConfig {
  try {
    const configFile = fs.readFileSync(filePath, 'utf8');
    const newConfig: IConfig = JSON.parse(configFile);
    _.merge(config, replaceWithAbsolutePaths(newConfig, filePath));
  } catch (error) {
    Log.log(`WARNING: File "${filePath}" is invalid.`);
  }
  return config;
}

/**
 * Replaces all relative paths in the environments with absolute paths.
 */
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
