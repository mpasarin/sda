import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';

/**
 * Action types
 */
export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const SELECT_ENV = 'SELECT_ENV';
export const SET_ENV = 'SET_ENV';
export const SET_BRANCH_NAME = 'SET_BRANCH_NAME';

export function updateConfig(config: IConfig) {
  return {
    type: UPDATE_CONFIG,
    config
  };
}

export function selectEnv(envId: string) {
  return {
    type: SELECT_ENV,
    envId
  };
}

export function setEnv(envId: string, env: IEnvironment) {
  return {
    type: SET_ENV,
    envId,
    env
  };
}

export function setBranchName(envId: string, branchName: string) {
  return {
    type: SET_BRANCH_NAME,
    envId,
    branchName
  };
}
