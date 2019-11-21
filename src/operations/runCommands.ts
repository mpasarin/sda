import executeCommands from '../command/executeCommands';
import getCommands from '../command/getCommands';
import ExecutionConfig from '../ExecutionConfig';
import { getAllEnvironments } from '../getEnvironment';
import { IEnvironment } from '../interfaces';
import Log from '../Log';

/**
 * Executes all commands from the execution config.
 * If an environment is passed, it executes the commands in that environment instead of the one from the EC.
 */
export default function runCommands(ec: ExecutionConfig) {
  return ec.runInAllEnvironments ? runInAllEnvironments(ec) : runCommandsInEnv(ec, ec.env);
}

function runCommandsInEnv(ec: ExecutionConfig, env: IEnvironment) {
  const commands = getCommands(env, ec.commands, ec.params);
  executeCommands(commands, env);
}

/** Executes the same commands on all environments */
function runInAllEnvironments(ec: ExecutionConfig) {
  const envs = getAllEnvironments(ec.config);

  envs.forEach((env) => {
    try {
      Log.log(`Environment "${env.id}"`);
      runCommandsInEnv(ec, env);
    } catch (error) {
      Log.error(`Error: Failed to run in environment "${env.id}". Inner error: ${error.message}`);
    }
  });
}
