import { now } from 'lodash';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import {
  END_COMMAND,
  SELECT_ENV,
  SET_BRANCH_NAME,
  START_COMMAND,
  UPDATE_CONFIG,
} from './actions';
import addAllEnvironment from './addAllEnvironment';
import getEnvsById from './getEnvsById';
import IState from './IState';

export default function reducer(
  state: IState | undefined,
  action: any
): IState {
  switch (action.type) {
    case UPDATE_CONFIG:
      const config: IConfig = action.config;
      const envsById = getEnvsById(config);
      addAllEnvironment(config, envsById);

      let selectedEnvId = state!.selectedEnvId;
      if (!selectedEnvId || !envsById[selectedEnvId]) {
        selectedEnvId = Object.keys(envsById)[0];
      }

      return Object.assign({}, state, { config, envsById, selectedEnvId });
    case SELECT_ENV:
      return Object.assign({}, state, { selectedEnvId: action.envId });
    case SET_BRANCH_NAME:
      const setBranchState = Object.assign({}, state);
      setBranchState.branchNameByEnvId[action.envId] = action.branchName;
      setBranchState.lastBranchUpdate = now();
      return setBranchState;
    case START_COMMAND:
      const startCommandState = Object.assign({}, state);
      startCommandState.commandsRunning[action.cmdId] = true;
      startCommandState.numberOfCommandsRunning++;
      return startCommandState;
    case END_COMMAND:
      const endCommandState = Object.assign({}, state);
      endCommandState.commandsRunning[action.cmdId] = false;
      endCommandState.numberOfCommandsRunning--;
      return endCommandState;
    default:
      return state!;
  }
}
