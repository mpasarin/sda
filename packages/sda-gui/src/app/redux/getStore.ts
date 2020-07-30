import { now } from 'lodash';
import { createStore } from 'redux';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import addAllEnvironment from './addAllEnvironment';
import getEnvsById from './getEnvsById';
import IState from './IState';
import reducer from './reducer';

export default function getStore(config: IConfig) {
  const firstEnvId = Object.keys(config.environments)[0];
  const envsById = getEnvsById(config);
  addAllEnvironment(config, envsById);
  const initialState: IState = {
    config,
    selectedEnvId: firstEnvId,
    envsById,
    branchNameByEnvId: {},
    lastBranchUpdate: now(),
    commandsRunning: {},
    numberOfCommandsRunning: 0,
  };
  return createStore(reducer, initialState);
}
