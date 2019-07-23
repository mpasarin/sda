import * as child_process from 'child_process';
import { ICommand, IEnvironment } from './interfaces';
import Log from './Log';

const MAX_BUFFER = 20 * 1024 * 1024; // 20 MB

export default function executeCommands(commands: ICommand[], environment: IEnvironment): void {
  for (const command of commands) {
    executeCommand(command, environment);
  }
}

function executeCommand(command: ICommand, environment: IEnvironment): void {
  if (command.cmd) {
    Log.log(`Executing command "${command.id}" in environment "${environment.id}": ${command.cmd}`);
    for (const cmd of command.cmd) {
      child_process.execSync(cmd, { cwd: command.cwd || environment.path, stdio: 'inherit', maxBuffer: MAX_BUFFER });
    }
  }
}
