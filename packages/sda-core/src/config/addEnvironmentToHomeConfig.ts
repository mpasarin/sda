import { IEnvironment } from '../interfaces';
import HomeConfig from './HomeConfig';

export default function addEnvironmentToHomeConfigFile(env: IEnvironment) {
  const homeConfig = HomeConfig.create();
  homeConfig.addEnvironment(env);
  homeConfig.write();
}
