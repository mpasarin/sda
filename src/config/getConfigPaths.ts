import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';

export const configFileName = 'sdaconfig.json';

/**
 * Find all configuration files from the input folder path up to the root folder.
 * @param dir - Directory to start browsing up
 */
export default function getConfigPaths(dir: string): string[] {
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

    const userHomeConfigPath = tryGetUserHomeConfigPath();
    if (userHomeConfigPath) {
        paths.push(userHomeConfigPath);
    }

    return paths;
}

/**
 * Returns the path to the config file in the user folder.
 * If the file doesn't exist returns undefined.
 */
function tryGetUserHomeConfigPath(): string | undefined {
    let homeFolder;
    if (process.env.HOME) {
      homeFolder = process.env.HOME;
    } else if (process.env.HOMEDRIVE && process.env.HOMEPATH) {
      homeFolder = path.join(process.env.HOMEDRIVE!, process.env.HOMEPATH!);
    }

    if (homeFolder) {
      const fileName = path.join(homeFolder, configFileName);
      if (fs.existsSync(fileName)) {
        return fileName;
      }
    }
  }
