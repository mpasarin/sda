import { now } from 'lodash';
import { SELECT_ENV, SET_BRANCH_NAME } from './actions';
import IState from './IState';

export default function reducer(
  state: IState | undefined,
  action: any
): IState {
  switch (action.type) {
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
