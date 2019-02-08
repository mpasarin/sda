#!/usr/bin/env node

import * as path from 'path';
import executeCommand from './executeCommand';
import getCommand from './getCommand';
import getConfig from './getConfig';
import getEnvironment from './getEnvironment';

try {
  // Find sem config
  const currentDir: string = path.normalize(process.cwd());
  const config = getConfig(currentDir);

  // Find actual environment
  const { def: envDef, name: envName, path: envPath } = getEnvironment(config, currentDir);

  // Run command
  const cmdName = process.argv[2]; // 0 is node, 1 is sem itself, 2 is the actual param
  if (!cmdName) {
    throw new Error('No command passed as input');
  }
  const command = getCommand(envDef, cmdName);

  console.log(`Executing command "${cmdName}" in environment "${envName}"`);

  executeCommand(command, envPath);
} catch (error) {
  console.log('Error: ' + error.message);
}
