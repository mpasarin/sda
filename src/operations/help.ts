// tslint:disable-next-line: no-reference
/// <reference path="../../typings/require-text.d.ts" />

import requireText from 'require-text';
import ExecutionConfig from '../ExecutionConfig';

export default function help(ec: ExecutionConfig) {
  console.log(requireText('../../docs/help.txt', require));
}
