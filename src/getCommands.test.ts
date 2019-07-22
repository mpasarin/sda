import getCommands from '../src/getCommands';
import Log from './Log';
import { env } from './test/Constants';

beforeAll(() => {
  Log.isEnabled = false;
});

test('get an inline command', () => {
  const cmd = getCommands(env, ['inlineCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['inline']);
});
test('get an inline array command', () => {
  const cmd = getCommands(env, ['inlineArrayCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['inline1', 'inline2']);
});

test('get a regular command', () => {
  const cmd = getCommands(env, ['regularCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['regular']);
});

test('get a regular array command', () => {
  const cmd = getCommands(env, ['regularArrayCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['regular1', 'regular2']);
});

test('get a command with folder', () => {
  const cmd = getCommands(env, ['commandWithFolder']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['withFolder']);
  expect(cmd[0].cwd).toEqual('C:\\');
});

test('get a non-existing command', () => {
  const cmd = getCommands(env, ['nonExistingCommand']);
  expect(cmd.length).toBe(0);
});

test('get two commands', () => {
  const cmd = getCommands(env, ['inlineCommand', 'regularCommand']);
  expect(cmd.length).toBe(2);
  expect(cmd[0].cmd).toEqual(['inline']);
  expect(cmd[1].cmd).toEqual(['regular']);
});

test('get an existing and a non-existing commands', () => {
  const cmd = getCommands(env, ['inlineCommand', 'nonExistingCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['inline']);
});

test('get a non-existing and an existing commands', () => {
  const cmd = getCommands(env, ['nonExistingCommand', 'inlineCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['inline']);
});

test('get a command from filepath', () => {
  const cmd = getCommands(env, ['commandWithFilePath']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].filePath).toEqual('someFilePath');
});