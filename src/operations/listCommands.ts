import Table from 'easy-table';
import ExecutionConfig from '../ExecutionConfig';
import { getAllEnvironments, getEnvironment } from '../getEnvironment';
import { IEnvironment } from '../interfaces';
import { IConfigCommand, IConfigEnvironment } from '../interfaces/IConfig';
import Log from '../Log';

export default function listCommands(ec: ExecutionConfig) {
  Log.verbose(`List commands for environment "${ec.env.id}" with template "${ec.env.templateId}"`);
  Log.verbose('');

  if (ec.runInAllEnvironments) {
    const envs = getAllEnvironments(ec.config);
    envs.forEach((env) => {
      console.log(`Environment: ${env.id}`);
      listEnvCommands(env);
    });
  } else {
    listEnvCommands(ec.env);
  }
}

function listEnvCommands(env: IEnvironment) {
  const template = env.template;
  const table = new Table();
  Object.keys(template.commands).forEach((cmdId) => {
    table.cell('Command', cmdId);
    const cmd = template.commands[cmdId];
    if ((cmd as IConfigCommand).description) {
      table.cell('Description', (cmd as IConfigCommand).description);
    }
    table.newRow();
  });
  console.log(table.toString());
}
