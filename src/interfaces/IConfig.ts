export interface IConfig {
  templates: { [id: string]: IConfigTemplate };
  /**
   * Map to define the different environments managed by this file.
   */
  environments: { [name: string]: IConfigEnvironment };
}

export interface IConfigEnvironment {
  /**
   * Path to the root of the environment. Either relative to the config file or absolute.
   */
  path: string;
  /**
   * Template id for this environment.
   */
  templateId: string;
}

export interface IConfigTemplate {
  /**
   * Map to define the different commands.
   * Key: Command name
   * Value: Either the command to execute as a string, or a command definition.
   */
  commands: { [name: string]: string | string[] | IConfigCommand };
}

/**
 * Command definition.
 * Includes the command to execute and, additionally, other parameters.
 */
export interface IConfigCommand {
  /**
   * Command to execute
   */
  cmd: string | string[];
  /**
   * Directory to run the command on
   */
  cwd?: string;

  /**
   * Parameters that can be passed to this command
   */
  validParams?: string[];
}
