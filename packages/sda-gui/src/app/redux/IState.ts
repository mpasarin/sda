import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';

export default interface IState {
  // Original config file, without any customization
  config: IConfig;
  selectedEnvId: string;
  // Enriched environments by id
  envsById: { [envId: string]: IEnvironment };
  branchNameByEnvId: { [envId: string]: string };
  lastBranchUpdate: number;
}
