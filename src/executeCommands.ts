import * as child_process from 'child_process';
import { IParsedCommand } from './getCommands';
import { IEnvironment } from './interfaces';
import Log from './Log';

const MAX_BUFFER = 20 * 1024 * 1024; // 20 MB

export default function executeCommands(commands: IParsedCommand[], environment: IEnvironment): void {
  for (const command of commands) {
    executeCommand(command, environment);
  }
}

function executeCommand(command: IParsedCommand, environment: IEnvironment): void {
  Log.log(`Executing command "${command.id}" in environment "${environment.id}"`);
  for (const cmd of command.cmd) {
    child_process.execSync(cmd, { cwd: command.cwd || environment.path, stdio: 'inherit', maxBuffer: MAX_BUFFER });
  }
}
