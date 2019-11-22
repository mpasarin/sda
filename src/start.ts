#!/usr/bin/env node

import ExecutionConfig from './ExecutionConfig';
import Log from './Log';
import { getOperationsMap } from './operations/Operations';

try {
  const ec = new ExecutionConfig();
  const map = getOperationsMap();
  if (map.has(ec.operation)) {
    map.get(ec.operation)!(ec);
  } else {
    throw new Error('Invalid operation.');
  }
} catch (error) {
  Log.error('Error: ' + error.message);
}
