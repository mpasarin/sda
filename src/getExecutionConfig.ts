import * as path from 'path';
import getConfig from './config/getConfig';
import ExecutionConfig from './ExecutionConfig';

export default function getExecutionConfig(): ExecutionConfig {
  const args = process.argv.splice(2);
  const currentDir: string = path.normalize(process.cwd());
  const config = getConfig(currentDir, getArgsConfigPath(args));
  return new ExecutionConfig(args, config, currentDir);
}

function getArgsConfigPath(args: string[]): string | undefined {
  for (let i = 0; i < args.length - 1; i++) {
    if (args[i] === '--config' || args[i] === '-c') {
      const configPath = args.splice(i, 2)[1];
      return configPath;
    }
  }
}
