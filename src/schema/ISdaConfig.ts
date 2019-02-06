export interface ISdaConfig {
  definitions: { [id: string]: IEnvironmentDefinition };
  /**
   * Map to define the different environments managed by this file.
   */
  environments: { [name: string]: IEnvironment };
}

export interface IEnvironment {
  /**
   * Path from the location of the .semconfig to the root of the environment.
   */
  path: string;
  /**
   * Definition id for this environment.
   */
  definition: string;
}

export interface IEnvironmentDefinition {
  /**
   * Map to define the different commands.
   * Key: Command name
   * Value: Either the command to execute as a string, or a command definition.
   */
  commands: { [name: string]: string | ICommandDefinition };
}

/**
 * Command definition.
 * Includes the command to execute and, additionally, other parameters.
 */
export interface ICommandDefinition {
  /**
   * Command to execute
   */
  cmd: string;
  /**
   * Directory to run the command on
   */
  cwd?: string;
}
