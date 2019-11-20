import * as fs from 'fs';
import _ from 'lodash';
import { IConfig } from '../interfaces/IConfig';
import Log from '../Log';
import getAbsolutePath from '../utils/getAbsolutePath';
import { EMPTY_CONFIG } from './Constants';
import getConfigPaths from './getConfigPaths';
import replaceConfigWithAbsolutePaths from './replaceConfigWithAbsolutePaths';
import warnOldConfigFilePaths from './warnOldConfigFilePaths';

export default function getConfig(rootDir: string, argsConfigPath?: string): IConfig {
  // Warn about old config file name for backwards compatibility
  warnOldConfigFilePaths(rootDir);

  const paths = getConfigPaths(rootDir);
  // If a config path is passed as arguments, merge it last
  if (argsConfigPath) {
    paths.push(getAbsolutePath(argsConfigPath, process.cwd()));
  }

  let config = EMPTY_CONFIG;
  for (const filePath of paths) {
    config = mergeConfig(config, filePath);
  }

  // An environment may point at a template defined elsehere.
  // If missing try to get it from the environment folder.
  Object.keys(config.environments).forEach((envId) => {
    const env = config.environments[envId];
    if (!config.templates[env.templateId]) {
      Log.verbose(`Environment "${envId}" is missing the template. Looking in the environment folder.`);
      const configPathsFromEnv = getConfigPaths(env.path);
      for (const filePath of configPathsFromEnv) {
        config = mergeConfig(config, filePath, true);
      }
    }
  });

  return config;
}

/**
 * Merges the contents of a config file with an IConfig object.
 * In case of conflicts, the contents of the config file are used.
 * If shyMode flag is on, the new config file won't take priority over the existing config.
 */
function mergeConfig(config: IConfig, filePath: string, shyMode?: boolean): IConfig {
  try {
    const configFile = fs.readFileSync(filePath, 'utf8');
    const newConfig: IConfig = JSON.parse(configFile);
    if (!shyMode) {
      Log.verbose(`Merging config with file "${filePath}"`);
      config = _.merge(config, replaceConfigWithAbsolutePaths(newConfig, filePath));
    } else {
      Log.verbose(`Merging config with file "${filePath}" in shy mode`);
      config = _.merge(replaceConfigWithAbsolutePaths(newConfig, filePath), config);
    }
  } catch (error) {
    Log.log(`WARNING: File "${filePath}" is invalid.`);
  }
  return config;
}
