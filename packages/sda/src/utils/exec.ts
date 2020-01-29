import * as child_process from 'child_process';
import * as util from 'util';
export default util.promisify(child_process.exec);
