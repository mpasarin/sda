import * as child_process from 'child_process';
import * as util from 'util';
import ExecutionConfig from '../ExecutionConfig';
import { IEnvironment } from '../interfaces';
import Log from '../Log';
import { IParsedCommand } from './getCommands';

const MAX_BUFFER = 20 * 1024 * 1024; // 20 MB
const exec = util.promisify(child_process.exec);

export default async function asyncExecuteCommands(
  commands: IParsedCommand[],
  environment: IEnvironment,
  ec: ExecutionConfig
): Promise<void> {
  for (const command of commands) {
    await asyncExecuteCommand(command, environment, ec);
  }
}

async function asyncExecuteCommand(
  command: IParsedCommand,
  environment: IEnvironment,
  ec: ExecutionConfig
): Promise<void> {
  Log.verbose(`Executing command "${command.id}" in environment "${environment.id}"`);
  for (const cmd of command.cmd) {
    const { stdout, stderr } = await exec(cmd, { cwd: command.cwd, maxBuffer: MAX_BUFFER });

    if (!ec.isSilent) {
      const trimmedOut = stdout.trim();
      if (trimmedOut) { console.log(trimmedOut); }

      const trimmedErr = stderr.trim();
      if (trimmedErr) { console.log(trimmedErr); }
    }
  }
}
