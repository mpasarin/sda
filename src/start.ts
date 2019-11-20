#!/usr/bin/env node

import ExecutionConfig from './ExecutionConfig';
import Log from './Log';
import attachEnvironment from './operations/attachEnvironment';
import listCommands from './operations/listCommands';
import listEnvironments from './operations/listEnvironments';
import { Operations } from './operations/Operations';
import runCommands from './operations/runCommands';
import setupEnvironment from './operations/setupEnvironment';

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

function getOperationsMap() {
  const map = new Map<Operations, (ec: ExecutionConfig) => void>();
  map.set(Operations.RunCommands, runCommands);
  map.set(Operations.ListEnvironments, listEnvironments);
  map.set(Operations.ListCommands, listCommands);
  map.set(Operations.SetupEnvironment, setupEnvironment);
  map.set(Operations.AttachEnvironment, attachEnvironment);
  return map;
}
