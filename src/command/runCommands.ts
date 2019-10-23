import { IEnvironment } from '../interfaces';
import executeCommands from './executeCommands';
import getCommands from './getCommands';
import getParams from './getParams';

/** Executes all commands passed in the args in a given environment */
export default function runCommands(env: IEnvironment, args: string[]) {
    const params = getParams(args);
    const commands = getCommands(env, args, params);
    executeCommands(commands, env);
  }
