import Table from 'easy-table';
import ExecutionConfig from '../ExecutionConfig';
import { getAllEnvironments } from '../getEnvironment';
import { IEnvironment } from '../interfaces';
import { IConfigCommand } from '../interfaces/IConfig';
import Log from '../Log';

export default function listCommands(ec: ExecutionConfig) {
  if (ec.runInAllEnvironments) {
    Log.verbose('List commands for all environments');
    const envs = getAllEnvironments(ec.config);
    envs.forEach((env) => {
      console.log(`Environment: ${env.id}`);
      listEnvCommands(env);
    });
  } else {
    Log.verbose(`List commands for environment "${ec.env.id}" with template "${ec.env.templateId}"`);
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
