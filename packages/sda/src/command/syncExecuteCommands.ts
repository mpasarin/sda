import * as child_process from 'child_process';
import ExecutionConfig from '../ExecutionConfig';
import { IEnvironment } from '../interfaces';
import Log from '../Log';
import { IParsedCommand } from './getCommands';

const MAX_BUFFER = 20 * 1024 * 1024; // 20 MB

export default function syncExecuteCommands(
  commands: IParsedCommand[],
  environment: IEnvironment,
  ec: ExecutionConfig
): void {
  for (const command of commands) {
    executeCommand(command, environment, ec);
  }
}

function executeCommand(command: IParsedCommand, environment: IEnvironment, ec: ExecutionConfig): void {
  Log.verbose(`Executing command "${command.id}" in environment "${environment.id}"`);
  for (const cmd of command.cmd) {
    child_process.execSync(
      cmd,
      {
        cwd: command.cwd,
        stdio: ec.isSilent ? 'ignore' : 'inherit',
        maxBuffer: MAX_BUFFER,
        timeout: command.timeout
      }
    );
  }
}
