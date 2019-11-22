import Table from 'easy-table';
import ExecutionConfig from '../ExecutionConfig';
import Log from '../Log';

export default function listEnvironments(ec: ExecutionConfig) {
  Log.verbose('List environments');
  Log.verbose('');

  const config = ec.config;
  const table = new Table();
  Object.keys(config.environments).forEach((envId) => {
    const templateId = config.environments[envId].templateId;
    table.cell('Environment id', envId);
    table.cell('Template id', templateId);
    table.cell('Path', config.environments[envId].path);
    if (ec.isVerbose) {
      table.cell('Description', config.templates[templateId].description);
    }
    table.newRow();
  });
  console.log(table.toString());
}
