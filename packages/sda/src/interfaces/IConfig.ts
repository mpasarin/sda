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
   * Value: Either the command to execute as a string, or a command definition
   */
  commands: { [name: string]: string | string[] | IConfigCommand };
  /**
   * Map to define aliases for commands.
   * Key: Alias name
   * Value: Command name
   */
  aliases?: { [name: string]: string };
  /**
   * Git repository URL. Used for the "setup" operation.
   */
  gitRepo?: string;
  /**
   * Description of the template. Used when listing environments and templates.
   */
  description?: string;
  /**
   * Icon of the template. Used in the UI to distinguish environments.
   * @ref https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
   */
  icon?: string;
}

/**
 * Command definition.
 * Includes the command to execute and, additionally, other parameters.
 */
export interface IConfigCommand {
  /**
   * Command to execute.
   */
  cmd?: string | string[];
  /**
   * Directory to run the command on.
   */
  cwd?: string;
  /**
   * Parameters that can be passed to this command.
   */
  validParams?: string[];
  /**
   * File path of script.
   */
  filePath?: string;
  /**
   * Interpreter for script.
   */
  interpreter?: string;
  /**
   * Description of the command. Used when listing commands.
   */
  description?: string;
  /**
   * Maximum time for the command to run, in milliseconds. Default is undefined.
   */
  timeout?: string;
  /**
   * Icon of the template. Used in the UI instead of the generic "play" button.
   * @ref https://developer.microsoft.com/en-us/fluentui#/styles/web/icons
   */
  icon?: string;
}
