import Table from 'easy-table';
import ExecutionConfig from '../ExecutionConfig';
import Log from '../Log';

export default function listEnvironments(ec: ExecutionConfig) {
  Log.verbose('List environments');
  Log.verbose('');

  const config = ec.config;
  const table = new Table();
  Object.keys(config.environments).forEach((envId) => {
    table.cell('Environment id', envId);
    table.cell('Template id', config.environments[envId].templateId);
    table.cell('Path', config.environments[envId].path);
    table.newRow();
  });
  console.log(table.toString());
}
