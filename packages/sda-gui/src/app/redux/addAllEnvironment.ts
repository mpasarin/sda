import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import getAllCommandIds from '../../getAllCommandIds';

/**
 * Adds the "all" environment into the envsById variable, with all the commands available.
 */
export default function addAllEnvironment(config: IConfig, envsById: { [envId: string]: IEnvironment }): void {
  const commands: { [id: string]: string } = {};
  // We just need the command id - The actual command is not used.
  // The command is called "sda -a <cmdId>" - Handled in CommandsList.tsx
  getAllCommandIds(config).forEach((cmdId) => commands[cmdId] = '');

  envsById.all = {
    id: 'all',
    path: '',
    templateId: 'all',
    template: {
      id: 'all',
      description: 'Run commands in all environments at once',
      icon: 'AllApps',
      commands
    }
  };
}
