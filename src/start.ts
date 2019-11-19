#!/usr/bin/env node

import runCommands from './command/runCommands';
import ExecutionConfig from './ExecutionConfig';
import { getAllEnvironments } from './getEnvironment';
import getExecutionConfig from './getExecutionConfig';
import Log from './Log';

try {
  const ec = getExecutionConfig();
  ec.runInAllEnvironments ? runInAllEnvironments(ec) : runCommands(ec);
} catch (error) {
  Log.error('Error: ' + error.message);
}

/** Executes the same commands on all environments */
function runInAllEnvironments(ec: ExecutionConfig) {
  const envs = getAllEnvironments(ec.config);

  envs.forEach((env) => {
    try {
      runCommands(ec, env);
    } catch (error) {
      Log.error(`Error: Failed to run in environment "${env.id}". Inner error: ${error.message}`);
    }
  });
}
