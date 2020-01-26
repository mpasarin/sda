import Table from 'easy-table';
import ExecutionConfig from '../ExecutionConfig';
import Log from '../Log';

export default function listTemplates(ec: ExecutionConfig) {
  Log.verbose('List templates');
  Log.verbose('');

  const config = ec.config;
  const table = new Table();
  Object.keys(config.templates).forEach((templateId) => {
    table.cell('Template id', templateId);
    table.cell('Description', config.templates[templateId].description);
    table.newRow();
  });
  console.log(table.toString());
}
