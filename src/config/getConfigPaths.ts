// tslint:disable-next-line: no-reference
/// <reference path="../../typings/yeoman-environment-resolver.d.ts" />

import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';
import resolver from 'yeoman-environment/lib/resolver';
import getAbsolutePath from '../utils/getAbsolutePath';
import { configFileName } from './Constants';
import HomeConfig from './HomeConfig';

/**
 * Find all configuration files. Includes current folder upwards, npm packages with configs and the home folder file.
 * @param rootDir - Current directory.
 */
export function getAllConfigPaths(rootDir: string, argsConfigPath?: string): string[] {
  const paths: string[] = [];

  paths.push(...getConfigPaths(rootDir));
  paths.push(...getPackageConfigPaths());

  const userHomeConfigPath = HomeConfig.getPathIfExists();
  if (userHomeConfigPath) {
    paths.push(userHomeConfigPath);
  }

  // If a config path is passed as arguments, merge it last
  if (argsConfigPath) {
    paths.push(getAbsolutePath(argsConfigPath, process.cwd()));
  }

  return paths;
}

/**
 * Returns the list of paths to config files from npm packages that start with sda-*
 */
function getPackageConfigPaths(): string[] {
  return resolver.findGeneratorsIn(resolver.getNpmPaths(false).reverse(), 'sda*')
    .map((dir) => path.join(dir, configFileName))
    .filter((fileName) => fs.existsSync(fileName));
}

/**
 * Find all configuration files from the input folder path up to the root folder.
 * @param dir - Directory to start browsing up
 */
export function getConfigPaths(dir: string): string[] {
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
