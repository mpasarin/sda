export interface IConfig {
  templates: { [id: string]: ITemplate };
  /**
   * Map to define the different environments managed by this file.
   */
  environments: { [name: string]: IEnvironment };
}

export interface IEnvironment {
  /**
   * Path to the root of the environment. Either relative to the config file or absolute.
   */
  path: string;
  /**
   * Template id for this environment.
   */
  template: string;
}

export interface ITemplate {
  /**
   * Map to define the different commands.
   * Key: Command name
   * Value: Either the command to execute as a string, or a command definition.
   */
  commands: { [name: string]: string | string[] | ICommand };
}

/**
 * Command definition.
 * Includes the command to execute and, additionally, other parameters.
 */
export interface ICommand {
  /**
   * Command to execute
   */
  cmd: string | string[];
  /**
   * Directory to run the command on
   */
  cwd?: string;
}
