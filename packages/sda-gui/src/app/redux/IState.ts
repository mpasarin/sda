import { IConfig } from 'sda/lib/interfaces/IConfig';

export default interface IState {
  config: IConfig;
  selectedEnvId: string;
  branchNameByEnvId: { [envId: string]: string };
  lastBranchUpdate: number;
}
