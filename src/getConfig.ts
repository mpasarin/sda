
import * as fs from 'fs';
import * as path from 'path';
import { ISemConfig } from './schema/ISemConfig';

export default function getConfig(rootDir: string): { config: ISemConfig, configDir: string } {
  let configDir: string = rootDir;
  while (!fs.existsSync(configDir + '/.semconfig')) {
    configDir = configDir + '/..';
  }
  configDir = path.normalize(configDir);

  // Parse sem config
  const configFile = fs.readFileSync(configDir + '/.semconfig', 'utf8');
  const config: ISemConfig = JSON.parse(configFile);
  return { config, configDir };
}
