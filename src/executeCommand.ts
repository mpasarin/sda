import * as child_process from 'child_process';
import { ICommand } from './interfaces/IConfig';

const MAX_BUFFER = 20 * 1024 * 1024; // 20 MB

export default function executeCommand(command: ICommand, envPath: string): void {
  if (typeof command.cmd === 'string') {
    command.cmd = [command.cmd];
  }

  for (const cmd of command.cmd) {
    child_process.execSync(cmd, { cwd: command.cwd || envPath, stdio: 'inherit', maxBuffer: MAX_BUFFER });
  }
}
