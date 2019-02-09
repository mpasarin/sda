#!/usr/bin/env node

import * as path from 'path';
import executeCommands from './executeCommands';
import getCommands from './getCommands';
import getConfig from './getConfig';
import getEnvironment from './getEnvironment';

try {
  // Find sem config
  const currentDir: string = path.normalize(process.cwd());
  const config = getConfig(currentDir);

  const args = process.argv.splice(2);

  // Find actual environment
  const environment = getEnvironment(config, currentDir, args);

  // Run command
  const cmdName = args[0]; // So far the first argument is the command
  if (!cmdName) {
    throw new Error('No command passed as input');
  }
  const commands = getCommands(environment, args);
  executeCommands(commands, environment);
} catch (error) {
  console.log('Error: ' + error.message);
}
