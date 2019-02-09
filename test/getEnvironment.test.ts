import getEnvironment from '../src/getEnvironment';
import { badConfig, config } from './Constants';

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
  const env = getEnvironment(config, '', ['aCommand', 'testEnv']);
  expect(env.id).toBe('testEnv');
  expect(env.template.id).toBe(env.templateId);
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
