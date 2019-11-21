import ExecutionConfig from '../ExecutionConfig';
import attachEnvironment from './attachEnvironment';
import help from './help';
import listCommands from './listCommands';
import listEnvironments from './listEnvironments';
import listTemplates from './listTemplates';
import runCommands from './runCommands';
import setupEnvironment from './setupEnvironment';

export enum Operations {
  RunCommands,
  ListEnvironments,
  ListCommands,
  ListTemplates,
  SetupEnvironment,
  AttachEnvironment,
  Help
}

export function getOperationsMap() {
  const map = new Map<Operations, (ec: ExecutionConfig) => void>();
  map.set(Operations.RunCommands, runCommands);
  map.set(Operations.ListEnvironments, listEnvironments);
  map.set(Operations.ListCommands, listCommands);
  map.set(Operations.ListTemplates, listTemplates);
  map.set(Operations.SetupEnvironment, setupEnvironment);
  map.set(Operations.AttachEnvironment, attachEnvironment);
  map.set(Operations.Help, help);
  return map;
}
