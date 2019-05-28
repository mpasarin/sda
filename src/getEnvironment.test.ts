import { getAllEnvironments, getEnvironment } from '../src/getEnvironment';
import { badConfig, config, template } from './test/Constants';

describe('getEnvironment', () => {
  test('get the environment from the arguments', () => {
    const env = getEnvironment(config, '', ['testEnv']);
    expect(env.id).toBe('testEnv');
    expect(env.template).toBeDefined();
  });

  test('get the environment from the arguments before the command', () => {
    const env = getEnvironment(config, '', ['testEnv', 'aCommand']);
    expect(env.id).toBe('testEnv');
    expect(env.template.id).toBe(env.templateId);
  });

  test('get the environment from the arguments after the command', () => {
    expect(() => getEnvironment(config, '', ['aCommand', 'testEnv'])).toThrow();
  });

  test('get the environment from inside env path', () => {
    const env = getEnvironment(config, 'C:\\folderA\\folderB\\folderC', []);
    expect(env.id).toBe('testEnv');
    expect(env.template.id).toBe(env.templateId);
  });

  test('get the environment from root env path', () => {
    const env = getEnvironment(config, 'C:\\folderA\\folderB', []);
    expect(env.id).toBe('testEnv');
    expect(env.template.id).toBe(env.templateId);
  });

  test('get the environment from outside env path fails', () => {
    expect(() => getEnvironment(config, 'C:\\folderA', [])).toThrow();
  });

  test('enviroment has invalid template id fails', () => {
    expect(() => getEnvironment(badConfig, 'D:\\', ['badEnv'])).toThrow();
  });

  test('enviroment does not exist neither in path nor in arguments fails', () => {
    expect(() => getEnvironment(badConfig, 'D:\\', ['badInput'])).toThrow();
  });
});

describe('getAllEnvironments', () => {
  test('no enviroments returns empty array', () => {
    const cfg = {
      templates: {},
      environments: {}
    };
    const envs = getAllEnvironments(cfg);
    expect(envs.length).toBe(0);
  });

  test('one enviroment returns a single element array', () => {
    const cfg = {
      templates: { tid: template },
      environments: { test: { path: 'C:\\testFolder', templateId: 'tid' } }
    };
    const envs = getAllEnvironments(cfg);
    expect(envs.length).toBe(1);
    expect(envs[0].id).toBe('test');
    expect(envs[0].template).toEqual(template);
  });

  test('multiple enviroment returns an array', () => {
    const cfg = {
      templates: { tid: template },
      environments: {
        test1: { path: 'C:\\testFolder1', templateId: 'tid' },
        test2: { path: 'C:\\testFolder2', templateId: 'tid' }
      }
    };
    const envs = getAllEnvironments(cfg);
    expect(envs.length).toBe(2);
    expect(envs[0].id).toBe('test1');
    expect(envs[0].template).toEqual(template);
    expect(envs[1].id).toBe('test2');
    expect(envs[1].template).toEqual(template);
  });
});
