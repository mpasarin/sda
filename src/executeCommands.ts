import * as child_process from 'child_process';
import fs from 'fs';
import { ICommand, IEnvironment } from './interfaces';
import Log from './Log';

const MAX_BUFFER = 20 * 1024 * 1024; // 20 MB

export default function executeCommands(commands: ICommand[], environment: IEnvironment): void {
  for (const command of commands) {
    executeCommand(command, environment);
  }
}

function executeCommand(command: ICommand, environment: IEnvironment): void {
  if (command.filePath) {
    Log.log(`Executing command from file at path:"${command.filePath}" in environment "${environment.id}"`);
    const fileCmd = fs.readFileSync(command.filePath, 'utf8');
    child_process.execSync(fileCmd, { cwd: command.cwd || environment.path, stdio: 'inherit', maxBuffer: MAX_BUFFER });
  }
  Log.log(`Executing command "${command.id}" in environment "${environment.id}"`);
  if (command.cmd) {
    for (const cmd of command.cmd) {
      child_process.execSync(cmd, { cwd: command.cwd || environment.path, stdio: 'inherit', maxBuffer: MAX_BUFFER });
    }
  }
}
