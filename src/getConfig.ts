
import * as fs from 'fs';
import * as path from 'path';
import { ISdaConfig } from './schema/ISdaConfig';

const configFileName = '.sdaconfig';

export default function getConfig(rootDir: string): { config: ISdaConfig, configDir: string } {
  const configDir = findConfigDir(rootDir);
  const configFile = fs.readFileSync(path.join(configDir, configFileName), 'utf8');
  const config: ISdaConfig = JSON.parse(configFile);
  return { config, configDir };
}

function findConfigDir(rootDir: string): string {
  let configDir: string = rootDir;
  while (!fs.existsSync(path.join(configDir, configFileName))) {
    configDir = configDir + '/..';
  }
  return path.normalize(configDir);
}
