import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';
import { configFileName } from './Constants';
import HomeConfig from './HomeConfig';

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

    const userHomeConfigPath = HomeConfig.getPathIfExists();
    if (userHomeConfigPath) {
        paths.push(userHomeConfigPath);
    }

    return paths;
}
