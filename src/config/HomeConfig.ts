import * as fs from 'fs';
import * as path from 'path';
import { IEnvironment } from '../interfaces';
import { IConfig } from '../interfaces/IConfig';
import Log from '../Log';
import { configFileName, EMPTY_CONFIG } from './Constants';

export default class HomeConfig {

  public static create(): HomeConfig {
    const homeFolder = getHomeFolder();
    if (homeFolder) {
      try {
        const fileName = path.join(homeFolder, configFileName);
        if (!fs.existsSync(fileName)) {
          fs.writeFileSync(fileName, JSON.stringify(EMPTY_CONFIG, undefined, 2));
        }

        const configFile = fs.readFileSync(fileName, 'utf8');
        const config = JSON.parse(configFile);
        return new HomeConfig(config, fileName);
      } catch (err) {
        Log.error('Could not create home config object.');
        throw err;
      }
    } else {
      throw new Error('Home folder could not be found.');
    }
  }

  /**
   * Returns the path to the config file in the user folder.
   * If the file doesn't exist returns undefined.
   */
  public static getPathIfExists(): string | undefined {
    const homeFolder = getHomeFolder();
    if (homeFolder) {
      const fileName = path.join(homeFolder, configFileName);
      if (fs.existsSync(fileName)) {
        return fileName;
      }
    }
  }

  private config: IConfig;
  private fileName: string;

  private constructor(config: IConfig, fileName: string) {
    this.config = config;
    this.fileName = fileName;
  }

  public addEnvironment(env: IEnvironment) {
    this.config.environments[env.id] = {
      path: env.path,
      templateId: env.templateId
    };
  }

  public write() {
    const ws = fs.createWriteStream(this.fileName);
    ws.write(JSON.stringify(this.config, undefined, 2));
    ws.end();
  }
}

function getHomeFolder() {
  if (process.env.HOME) {
    return process.env.HOME;
  } else if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
    return path.join(process.env.HOMEDRIVE!, process.env.HOMEPATH!);
  }
}
