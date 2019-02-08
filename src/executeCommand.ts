import * as child_process from 'child_process';
import { ICommandDefinition } from './interfaces/IConfig';

export default function executeCommand(command: ICommandDefinition, envPath: string): void {
  child_process.exec(command.cmd, { cwd: command.cwd || envPath }, (error, stdout, stderr) => {
    if (!error) {
      console.log(stdout);
    } else {
      console.error('Error: ' + error.message);
      console.error('Output: ' + stdout);
      console.error('Error: ' + stderr);
    }
  });
}
