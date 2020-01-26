import { times } from 'lodash';
import asyncExecuteCommands from '../command/asyncExecuteCommands';
import getCommands from '../command/getCommands';
import syncExecuteCommands from '../command/syncExecuteCommands';
import ExecutionConfig from '../ExecutionConfig';
import { getAllEnvironments } from '../getEnvironment';
import { IEnvironment } from '../interfaces';
import Log from '../Log';

/**
 * Executes all commands from the execution config.
 * If an environment is passed, it executes the commands in that environment instead of the one from the EC.
 */
export default function runCommands(ec: ExecutionConfig) {
  return ec.runInAllEnvironments ? runInAllEnvironments(ec) : syncRunCommandsInEnv(ec, ec.env);
}

/** Executes the same commands on all environments */
function runInAllEnvironments(ec: ExecutionConfig) {
  const envs = getAllEnvironments(ec.config);
  const parallelRuns = Math.max(ec.parallelOperations, 1);

  if (parallelRuns > 1) {
    times(parallelRuns, () => asyncStartEnvironmentRun(envs, ec));
  } else {
    // With one parallel run, we can synchronously, so we get live console updates
    syncRunEnvironments(envs, ec);
  }
}

async function asyncStartEnvironmentRun(envs: IEnvironment[], ec: ExecutionConfig): Promise<void> {
  if (envs.length === 0) { return; }

  const env = envs.shift()!;
  try {
    Log.log(`Environment "${env.id}"`);
    await asyncRunCommandsInEnv(ec, env);
  } catch (error) {
    Log.error(`Failed to run in environment "${env.id}". Inner error: ${error.message}`);
  }

  return asyncStartEnvironmentRun(envs, ec);
}

async function asyncRunCommandsInEnv(ec: ExecutionConfig, env: IEnvironment) {
  const commands = getCommands(env, ec.commands, ec.params);
  return asyncExecuteCommands(commands, env, ec);
}

function syncRunEnvironments(envs: IEnvironment[], ec: ExecutionConfig): void {
  envs.forEach((env) => {
    try {
      Log.log(`Environment "${env.id}"`);
      syncRunCommandsInEnv(ec, env);
    } catch (error) {
      Log.error(`Failed to run in environment "${env.id}". Inner error: ${error.message}`);
    }
  });
}

function syncRunCommandsInEnv(ec: ExecutionConfig, env: IEnvironment) {
  const commands = getCommands(env, ec.commands, ec.params);
  return syncExecuteCommands(commands, env, ec);
}
