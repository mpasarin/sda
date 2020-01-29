import { IConfig } from '../interfaces/IConfig';

export const configFileName = 'sdaconfig.json';
export const previousConfigFileName = '.sdaconfig';

export const EMPTY_CONFIG: IConfig = {
  environments: {},
  templates: {}
};
