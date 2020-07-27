import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';

export default interface IState {
  // Original config file, without any customization
  config: IConfig;
  selectedEnvId: string;
  // Enriched environments by id
  envsById: { [envId: string]: IEnvironment };

  // Branch names
  branchNameByEnvId: { [envId: string]: string };
  lastBranchUpdate: number;

  // Running commands state
  // cmdId is in the form "envId__commandId" to avoid collisions
  commandsRunning: { [cmdId: string]: boolean };
  numberOfCommandsRunning: number;
}
