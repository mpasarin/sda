import _ from 'lodash';
import Log from '../Log';
import { env as environment } from '../test/Constants';
import getCommands, { IParsedCommand } from './getCommands';

beforeAll(() => {
  Log.isEnabled = false;
});
let env: any;
beforeEach(() => { env = _.cloneDeep(environment); });

test('get an inline command', () => {
  const cmd = getCommands(env, ['inlineCommand']);
  expectSingleCommand(cmd, 'inline');
});

test('get an inline array command', () => {
  const cmd = getCommands(env, ['inlineArrayCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['inline1', 'inline2']);
});

test('get a regular command', () => {
  const cmd = getCommands(env, ['regularCommand']);
  expectSingleCommand(cmd, 'regular');
});

test('get a regular array command', () => {
  const cmd = getCommands(env, ['regularArrayCommand']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['regular1', 'regular2']);
});

test('get a command with absolute folder', () => {
  const cmd = getCommands(env, ['commandWithAbsoluteFolder']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['withFolder']);
  expect(cmd[0].cwd).toEqual('C:\\testX\\testY');
});

test('get a command with relative folder', () => {
  const cmd = getCommands(env, ['commandWithRelativeFolder']);
  expect(cmd.length).toBe(1);
  expect(cmd[0].cmd).toEqual(['withFolder']);
  expect(cmd[0].cwd).toEqual('C:\\folderA\\folderB\\test1\\test2');
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
  expect(cmd[0].cwd).toEqual('C:\\folderA\\folderB');
  expect(cmd[1].cwd).toEqual('C:\\folderA\\folderB');
});

test('get an existing and a non-existing command', () => {
  const cmd = getCommands(env, ['inlineCommand', 'nonExistingCommand']);
  expectSingleCommand(cmd, 'inline');
});

test('get a non-existing and an existing command', () => {
  const cmd = getCommands(env, ['nonExistingCommand', 'inlineCommand']);
  expectSingleCommand(cmd, 'inline');
});
test('get a command from filepath', () => {
  const cmd = getCommands(env, ['commandWithFilePath']);
  expectSingleCommand(cmd, 'someFilePath');
});

test('get a command from filepath and interpreter', () => {
  const cmd = getCommands(env, ['commandWithFilePathAndInterpreter']);
  expectSingleCommand(cmd, 'node someFilePath');
});

test('get a command with no valid params', () => {
  const cmd = getCommands(env, ['regularCommand'], []);
  expectSingleCommand(cmd, 'regular');
});

test('get a command with a valid param', () => {
  const cmd = getCommands(env, ['commandWithParams'], [['-param', 'paramValue'], ['-invalidParam']]);
  expectSingleCommand(cmd, 'withParams -param paramValue');
});

test('get a command with a param and placeholder', () => {
  const cmd = getCommands(env, ['commandWithParamsPlaceholder'], [['/p']]);
  expectSingleCommand(cmd, 'withParams /p && anotherCommand');
});

test('get a command with a placeholder and no params', () => {
  const cmd = getCommands(env, ['commandWithParamsPlaceholder']);
  expectSingleCommand(cmd, 'withParams  && anotherCommand'); // Note the double space.
});

test('get a command that does not accept passed param', () => {
  const cmd = getCommands(env, ['commandWithParams'], [['-invalidParam', 'paramValue']]);
  expectSingleCommand(cmd, 'withParams');
});

function expectSingleCommand(command: IParsedCommand[], expectedCommandCmd: string) {
  expect(command.length).toBe(1);
  expect(command[0].cmd).toEqual([expectedCommandCmd]);
  expect(command[0].cwd).toEqual('C:\\folderA\\folderB');
}
