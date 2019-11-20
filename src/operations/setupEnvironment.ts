import ExecutionConfig from '../ExecutionConfig';
import Log from '../Log';
import attachEnvironmentAfterExecute from './attachEnvironmentAfterExecute';
import runCommands from './runCommands';

export default function setupEnvironment(ec: ExecutionConfig) {
  Log.verbose('Set up environment');
  Log.verbose('');

  attachEnvironmentAfterExecute(ec, (params) => {
    const { template, path } = params;
    if (!template.commands.setup) {
      const gitRepo = template.gitRepo;
      if (gitRepo) {
        template.commands.setup = `git clone ${gitRepo} ${path}`;
      } else {
        throw new Error(`The template "${template.id}" doesn't support the setup command.`);
      }
    }

    ec.commands = [];
    if (template.commands['pre-setup']) { ec.commands.push('pre-setup'); }
    ec.commands.push('setup');
    if (template.commands['post-setup']) { ec.commands.push('post-setup'); }
    ec.params = [];

    runCommands(ec);
  });
}
