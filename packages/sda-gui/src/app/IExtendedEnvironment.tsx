import { IEnvironment } from 'sda-core/lib/interfaces';

export interface IExtendedEnvironment extends IEnvironment {
    branchName?: string;
}
