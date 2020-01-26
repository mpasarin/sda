#!/usr/bin/env node

import ExecutionConfig from 'sda-core/lib/ExecutionConfig';
import Log from 'sda-core/lib/Log';
import { getOperationsMap } from 'sda-core/lib/operations/Operations';

try {
  const ec = new ExecutionConfig();
  const map = getOperationsMap();
  if (map.has(ec.operation)) {
    map.get(ec.operation)!(ec);
  } else {
    throw new Error('Invalid operation.');
  }
} catch (error) {
  Log.error(error.message);
}
