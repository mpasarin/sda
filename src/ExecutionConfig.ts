import * as path from 'path';
import getParams from './command/getParams';
import getConfig from './config/getConfig';
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
  public setupParameters?: {
    templateId: string,
    path?: string
  };

  constructor() {
    const args = process.argv.splice(2);

    Log.isVerbose = checkFlag(args, '-v') || checkFlag(args, '--verbose');

    const currentDir: string = path.normalize(process.cwd());
    this.config = getConfig(currentDir, getArgsConfigPath(args));
    this.runInAllEnvironments = checkFlag(args, '-a', 0) || checkFlag(args, '--all', 0);
    this.operation = this.getOperation(args);

    if (this.operation === Operations.SetupEnvironment || this.operation === Operations.AttachEnvironment) {
      this.setupParameters = {
        templateId: args[0],
        path: args[1]
      };
    }

    if (this.operation !== Operations.ListEnvironments) {
      this.env = getEnvironment(this.config, args[0], currentDir);
      if (this.env.id === args[0]) {
        args.shift(); // Remove the environment from the arguments
      }
    } else {
      this.env = undefined as any;
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
    if (checkFlag(args, 'setup')) { return Operations.SetupEnvironment; }
    if (checkFlag(args, 'attach')) { return Operations.AttachEnvironment; }
    return Operations.RunCommands;
  }
}

function getArgsConfigPath(args: string[]): string | undefined {
  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] === '--config' || args[i] === '-c') {
      const configPath = args.splice(i, 2)[1];
      return configPath;
    }
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
