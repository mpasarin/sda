import getParams from './command/getParams';
import { getEnvironment } from './getEnvironment';
import { IEnvironment } from './interfaces';
import { IConfig } from './interfaces/IConfig';
import Log from './Log';
import { Operations } from './operations/Operations';

export default class ExecutionConfig {
  public config: IConfig;
  public runInAllEnvironments: boolean;
  public operation: Operations;
  public env: IEnvironment;
  public params: string[][];
  public commands: string[];

  constructor(args: string[], config: IConfig, currentDir: string) {
    Log.isVerbose = checkFlag(args, '-v') || checkFlag(args, '--verbose');

    this.config = config;
    this.runInAllEnvironments = checkFlag(args, '-a', 0) || checkFlag(args, '--all', 0);
    this.operation = this.getOperation(args);

    this.env = getEnvironment(config, currentDir, args);
    if (this.env.id === args[0]) {
      args.shift(); // Remove the environment from the arguments
    }

    this.params = getParams(args); // getParams already removes them from args
    this.commands = args;
  }

  /**
   * Returns the operation to execute.
   *
   * "sda" with no arguments - List environments
   * "sda list" - List environments
   * "sda -a list" - List commands for all environments
   * "sda <env> list" - List commands for an environment
   * Other scenarios just run the commands
   */
  private getOperation(args: string[]): Operations {
    if (args.length === 0) { return Operations.ListEnvironments; }
    if (!this.runInAllEnvironments && checkFlag(args, 'list', 0)) { return Operations.ListEnvironments; }
    if (checkFlag(args, 'list', this.runInAllEnvironments ? 0 : 1)) { return Operations.ListCommands; }
    return Operations.RunCommands;
  }
}

/** Checks a flag. Returns true if the flag is present and removes it from the args variable. */
function checkFlag(args: string[], flag: string, index?: number): boolean {
  const foundIndex = args.indexOf(flag);
  if ((index !== undefined && foundIndex === index) || (index === undefined && foundIndex > -1)) {
    args.splice(foundIndex, 1);
    return true;
  } else {
    return false;
  }
}
