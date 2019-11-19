#!/usr/bin/env node

import runCommands from './command/runCommands';
import ExecutionConfig from './ExecutionConfig';
import { getAllEnvironments } from './getEnvironment';
import getExecutionConfig from './getExecutionConfig';
import Log from './Log';
import listCommands from './operations/listCommands';
import listEnvironments from './operations/listEnvironments';
import { Operations } from './operations/Operations';

try {
  const ec = getExecutionConfig();
  switch (ec.operation) {
    case Operations.ListEnvironments:
      listEnvironments(ec);
      break;
    case Operations.ListCommands:
      listCommands(ec);
      break;
    case Operations.RunCommands:
    default:
      ec.runInAllEnvironments ? runInAllEnvironments(ec) : runCommands(ec);
      break;
  }
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
