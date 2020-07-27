import { getEnvironment } from 'sda/lib/getEnvironment';
import { IEnvironment } from 'sda/lib/interfaces';
import { IConfig } from 'sda/lib/interfaces/IConfig';

export default function getEnvsById(config: IConfig): { [envId: string]: IEnvironment } {
  const envsById: { [envId: string]: IEnvironment } = {};
  Object.keys(config.environments)
    .map((envId) => getEnvironment(config, envId))
    .forEach((env) => (envsById[env.id] = env));
  return envsById;
}
