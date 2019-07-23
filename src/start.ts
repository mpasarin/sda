#!/usr/bin/env node

import * as path from 'path';
import getConfig from './config/getConfig';
import executeCommands from './executeCommands';
import getCommands from './getCommands';
import { getAllEnvironments, getEnvironment } from './getEnvironment';
import getParams from './getParams';
import { IEnvironment } from './interfaces';
import { IConfig } from './interfaces/IConfig';
import Log from './Log';

try {
  let args = process.argv.splice(2);

  // Find config file
  const currentDir: string = path.normalize(process.cwd());
  const config = getConfig(currentDir, getArgsConfigPath(args));

  if (shouldRunInAllEnvironments(args)) {
    args = args.splice(1);
    runInAllEnvironments(config, args);
  } else {
    const env = getEnvironment(config, currentDir, args);
    // This makes sure it doesn't say "Command not found" for the environment name.
    if (args[0] === env.id) {
      args = args.splice(1);
    }

    runCommands(env, args);
  }
} catch (error) {
  Log.error('Error: ' + error.message);
}

/** Returns true if user ran the command with '-a' or '--all' */
function shouldRunInAllEnvironments(args: string[]): boolean {
  return args[0] === '-a' || args[0] === '--all';
}

function getArgsConfigPath(args: string[]): string | undefined {
  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] === '--config' || args[i] === '-c') {
      return args[i + 1];
    }
  }
}

/** Executes the same commands on all environments */
function runInAllEnvironments(config: IConfig, args: string[]) {
  const envs = getAllEnvironments(config);

  envs.forEach((env) => {
    try {
      runCommands(env, args);
    } catch (error) {
      Log.error(`Error: Failed to run in environment "${env.id}". Inner error: ${error.message}`);
    }
  });
}

/** Executes all commands passed in the args in a given environment */
function runCommands(env: IEnvironment, args: string[]) {
  const params = getParams(args);
  const commands = getCommands(env, args, params);
  executeCommands(commands, env);
}
