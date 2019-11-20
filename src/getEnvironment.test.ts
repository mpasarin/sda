import { getAllEnvironments, getEnvironment } from '../src/getEnvironment';
import { badConfig, config, configWithDefault, template } from './test/Constants';

describe('getEnvironment', () => {
  test('get the environment from the id', () => {
    const env = getEnvironment(config, 'testEnv');
    expect(env.id).toBe('testEnv');
    expect(env.template).toBeDefined();
  });

  test('get the environment from an unexisting id', () => {
    expect(() => getEnvironment(config, 'badInput')).toThrow();
  });

  test('get the environment from inside env path', () => {
    const env = getEnvironment(config, '', 'C:\\folderA\\folderB\\folderC');
    expect(env.id).toBe('testEnv');
    expect(env.template.id).toBe(env.templateId);
  });

  test('get the environment from inside env path with unexisting id', () => {
    const env = getEnvironment(config, 'badInput', 'C:\\folderA\\folderB\\folderC');
    expect(env.id).toBe('testEnv');
    expect(env.template.id).toBe(env.templateId);
  });

  test('get the environment from root env path', () => {
    const env = getEnvironment(config, '', 'C:\\folderA\\folderB');
    expect(env.id).toBe('testEnv');
    expect(env.template.id).toBe(env.templateId);
  });

  test('get the environment from outside env path fails', () => {
    expect(() => getEnvironment(config, '', 'C:\\folderA')).toThrow();
  });

  test('enviroment has invalid template id fails', () => {
    expect(() => getEnvironment(badConfig, 'badEnv', 'D:\\')).toThrow();
  });

  test('enviroment does not exist neither in path nor in arguments fails', () => {
    expect(() => getEnvironment(badConfig, 'badInput', 'D:\\')).toThrow();
  });

  test('get environment with defaults', () => {
    const env = getEnvironment(configWithDefault, 'testEnv');
    expect(env.template.commands.defaultCommand).toBe('default'); // from the default
    expect(env.template.commands.inlineCommand).toBe('inline'); // from the actual template
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
