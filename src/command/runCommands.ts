import ExecutionConfig from '../ExecutionConfig';
import { IEnvironment } from '../interfaces';
import executeCommands from './executeCommands';
import getCommands from './getCommands';
import getParams from './getParams';

/**
 * Executes all commands from the execution config.
 * If an environment is passed, it executes the commands in that environment instead of the one from the EC.
 */
export default function runCommands(ec: ExecutionConfig, env?: IEnvironment) {
    env = env || ec.env;
    const commands = getCommands(env, ec.commands, ec.params);
    executeCommands(commands, env);
  }
