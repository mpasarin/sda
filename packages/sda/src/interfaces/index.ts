import { IConfigCommand, IConfigEnvironment, IConfigTemplate } from './IConfig';

export type INamed<T> = T & {
  id: string;
};

export type IEnvironment = INamed<IConfigEnvironment> & { template: ITemplate };
export type ITemplate = INamed<IConfigTemplate>;
export type ICommand = INamed<IConfigCommand>;
