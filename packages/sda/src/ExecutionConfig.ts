import * as path from 'path';
import getParams from './command/getParams';
import getConfig from './config/getConfig';
import { getEnvironment } from './getEnvironment';
import { IEnvironment } from './interfaces';
import { IConfig } from './interfaces/IConfig';
import Log from './Log';
import { Operations } from './operations/Operations';

export default class ExecutionConfig {
  public isVerbose: boolean;
  public isSilent: boolean;
  public config: IConfig;
  public runInAllEnvironments: boolean;
  public parallelOperations: number;
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
    this.isVerbose = checkBooleanFlag(args, '--verbose', '-v');
    this.isSilent = checkBooleanFlag(args, '--silent', '-s');
    Log.isVerbose = this.isVerbose;

    const currentDir: string = path.normalize(process.cwd());
    this.config = getConfig(currentDir, getArgsConfigPath(args));
    this.runInAllEnvironments = checkBooleanFlag(args, '--all', '-a', 0);
    this.parallelOperations = checkNumberFlag(args, '--parallel', '-p') || 1;
    this.operation = this.getOperation(args);

    if (this.operation === Operations.SetupEnvironment || this.operation === Operations.AttachEnvironment) {
      this.setupParameters = {
        templateId: args[0],
        path: args[1]
      };
    }

    // Only try to get an environment for operations that require it
    if (
      !this.runInAllEnvironments
      && (this.operation === Operations.RunCommands
        || this.operation === Operations.ListCommands)
    ) {
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
    if (args.length === 0) { return Operations.Help; }
    if (!this.runInAllEnvironments && checkBooleanFlag(args, 'list', 'l', 0)) { return Operations.ListEnvironments; }
    if (checkBooleanFlag(args, 'list', 'l', this.runInAllEnvironments ? 0 : 1)) { return Operations.ListCommands; }
    if (checkBooleanFlag(args, 'listTemplates', 'lt', 0)) { return Operations.ListTemplates; }
    if (checkBooleanFlag(args, 'setup', 's')) { return Operations.SetupEnvironment; }
    if (checkBooleanFlag(args, 'attach', 'a')) { return Operations.AttachEnvironment; }
    if (checkBooleanFlag(args, 'help', 'h', 0)) { return Operations.Help; }
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
function checkBooleanFlag(args: string[], flag: string, shorthand?: string, index?: number): boolean {
  const foundIndex = Math.max(args.indexOf(flag), shorthand ? args.indexOf(shorthand) : -1);
  if ((index !== undefined && foundIndex === index) || (index === undefined && foundIndex > -1)) {
    args.splice(foundIndex, 1);
    return true;
  } else {
    return false;
  }
}

/** Checks a flag. Returns true if the flag is present and removes it from the args variable. */
function checkNumberFlag(args: string[], flag: string, shorthand?: string, index?: number): number | undefined {
  const foundIndex = Math.max(args.indexOf(flag), shorthand ? args.indexOf(shorthand) : -1);
  if ((index !== undefined && foundIndex === index) || (index === undefined && foundIndex > -1)) {
    const removedArgs = args.splice(foundIndex, 2);
    return parseInt(removedArgs[1], undefined);
  } else {
    return undefined;
  }
}
