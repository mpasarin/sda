
import * as fs from 'fs';
import * as path from 'path';
import Log from '../Log';
import { configFileName, previousConfigFileName } from './Constants';

/**
 * Warn about old configuration files. Browses from the input folder path up to the root folder.
 * @param dir - Directory to start browsing up
 */
export default function warnOldConfigFilePaths(dir: string): void {
  dir = path.normalize(dir);
  let foundOldFiles = false;
  const root: string = path.parse(dir).root;
  do {
    const fileName = path.join(dir, previousConfigFileName);
    if (fs.existsSync(fileName)) {
      if (!foundOldFiles) {
        Log.log('');
        Log.log('!!!!! WARNING !!!!!');
      }
      foundOldFiles = true;
      Log.log(`Old config file found in "${fileName}". Please rename to "${configFileName}".`);
    }
    dir = path.normalize(path.join(dir, '..'));
  } while (dir !== root);
  if (foundOldFiles) {
    Log.log('!!!!! WARNING !!!!!');
    Log.log('');
  }
}
