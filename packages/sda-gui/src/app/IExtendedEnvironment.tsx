import { IEnvironment } from 'sda/lib/interfaces';

export interface IExtendedEnvironment extends IEnvironment {
    branchName?: string;
}
