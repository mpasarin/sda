import { now } from 'lodash';
import { createStore } from 'redux';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import IState from './IState';
import reducer from './reducer';

export default function getStore(config: IConfig) {
  const firstEnvId = Object.keys(config.environments)[0];
  const initialState: IState = {
    config,
    selectedEnvId: firstEnvId,
    branchNameByEnvId: {},
    lastBranchUpdate: now()
  };
  return createStore(reducer, initialState);
}
