import { now } from 'lodash';
import { getEnvironment } from 'sda/lib/getEnvironment';
import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import { SELECT_ENV, SET_BRANCH_NAME, UPDATE_CONFIG } from './actions';
import getEnvsById from './getEnvsById';
import IState from './IState';

export default function reducer(
  state: IState | undefined,
  action: any
): IState {
  switch (action.type) {
    case UPDATE_CONFIG:
      const config = action.config;
      const envsById = getEnvsById(config);
      return Object.assign({}, state, { config, envsById });
    case SELECT_ENV:
      return Object.assign({}, state, { selectedEnvId: action.envId });
    case SET_BRANCH_NAME:
      const newState = Object.assign({}, state);
      newState.branchNameByEnvId[action.envId] = action.branchName;
      newState.lastBranchUpdate = now();
      return newState;
    default:
      return state!;
  }
}
