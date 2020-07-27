import * as fs from 'fs';
import * as path from 'path';
import { INamed } from '../interfaces';
import { IConfig, IConfigEnvironment, IConfigTemplate } from '../interfaces/IConfig';
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

  public addEnvironment(env: INamed<IConfigEnvironment>) {
    if (!this.config.environments) {
      this.config.environments = {};
    }

    this.config.environments[env.id] = {
      path: env.path,
      templateId: env.templateId
    };
  }

  public addTemplate(template: INamed<IConfigTemplate>) {
    if (!this.config.templates) {
      this.config.templates = {};
    }

    this.config.templates[template.id] = {
      commands: template.commands,
      aliases: template.aliases,
      gitRepo: template.gitRepo,
      description: template.description
    };
  }

  public async write(): Promise<void> {
    const ws = fs.createWriteStream(this.fileName);
    ws.write(JSON.stringify(this.config, undefined, 2));
    ws.end();
    return new Promise<void>((resolve, reject) => {
      ws.on('finish', () => { Log.verbose('Config file written.'); resolve(); });
      ws.on('error', (error) => { Log.verbose(`Error writing config file. ${error}`); reject(error); });
    });
  }
}

export function getHomeFolder() {
  if (process.env.HOME) {
    return process.env.HOME;
  } else if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
    return path.join(process.env.HOMEDRIVE!, process.env.HOMEPATH!);
  }
}
