import getParams from './command/getParams';
import { getEnvironment } from './getEnvironment';
import { IEnvironment } from './interfaces';
import { IConfig } from './interfaces/IConfig';
import Log from './Log';

export default class ExecutionConfig {
  public config: IConfig;
  public runInAllEnvironments: boolean;
  public env: IEnvironment;
  public commands: string[] = [];
  public params: string[][];

  constructor(args: string[], config: IConfig, currentDir: string) {
    this.config = config;

    this.runInAllEnvironments = checkFlag(args, '-a', 0) || checkFlag(args, '--all', 0);
    Log.isVerbose = checkFlag(args, '-v') || checkFlag(args, '--verbose');

    this.env = getEnvironment(config, currentDir, args);
    if (this.env.id === args[0]) {
      args.shift(); // Remove the environment from the arguments
    }

    this.params = getParams(args); // getParams already removes them from args
    this.commands = args;
  }
}

/** Checks a flag. Returns true if the flag is present and removes it from the args variable. */
function checkFlag(args: string[], flag: string, index?: number): boolean {
  const foundIndex = args.indexOf(flag);
  if ((index && foundIndex === index) || (!index && foundIndex > -1)) {
    args.splice(foundIndex, 1);
    return true;
  } else {
    return false;
  }
}
