import ExecutionConfig from '../ExecutionConfig';
import Log from '../Log';
import attachEnvironmentAfterExecute from './attachEnvironmentAfterExecute';

export default function attachEnvironment(ec: ExecutionConfig) {
  Log.verbose('Attach folder to a template');
  Log.verbose('');

  attachEnvironmentAfterExecute(ec, () => { /* Do nothing */ });
}
