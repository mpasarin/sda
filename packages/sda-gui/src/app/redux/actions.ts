/**
 * Action types
 */
export const SELECT_ENV = 'SELECT_ENV';
export const SET_BRANCH_NAME = 'SET_BRANCH_NAME';

export function selectEnv(envId: string) {
  return {
    type: SELECT_ENV,
    envId
  };
}

export function setBranchName(envId: string, branchName: string) {
  return {
    type: SET_BRANCH_NAME,
    envId,
    branchName
  };
}
