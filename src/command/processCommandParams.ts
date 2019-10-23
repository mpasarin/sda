import { IConfigCommand } from '../interfaces/IConfig';

export default function processCommandParams(command: IConfigCommand, params?: string[][]): IConfigCommand {
    const cmds: string[] = command.cmd as string[];
    const paramString = params ? getParamString(command, params) : '';
    for (let i = 0; i < cmds.length; i++) {
      cmds[i] = addParams(cmds[i], paramString);
    }
    return command;
  }

  /**
   * Finds all valid params for the specified command and concatenates them as a string.
   */
function getParamString(command: IConfigCommand, params: string[][]): string {
    if (!command.validParams || command.validParams.length === 0) {
      return '';
    }
    let paramString = '';
    for (const param of params) {
      if (command.validParams.indexOf(param[0]) > -1) {
        paramString += ' ' + param.join(' ');
      }
    }

    return paramString.trim();
  }

  /**
   * Adds parameter string to the command
   * If placeholder exists, add param string there. Otherwise, add to end.
   */
function addParams(cmd: string, paramString: string) {
    if (cmd.indexOf('%PARAM%') > -1) {
      return cmd.replace('%PARAM%', paramString);
    }
    return !!paramString ? cmd + ' ' + paramString : cmd;
  }
