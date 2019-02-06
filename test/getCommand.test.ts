import getCommand from '../src/getCommand';

const def = {
  commands: {
    inlineCommand: 'test1',
    regularCommand: {
      cmd: 'test2'
    },
    regularCommandWithFolder: {
      cmd: 'test2',
      cwd: 'C:\\'
    }
  },
};

test('get an inline command', () => {
  const cmd = getCommand(def, 'inlineCommand');
  expect(cmd.cmd).toBe('test1');
});

test('get a regular command', () => {
  const cmd = getCommand(def, 'regularCommand');
  expect(cmd.cmd).toBe('test2');
});

test('get a regular command with folder', () => {
  const cmd = getCommand(def, 'regularCommandWithFolder');
  expect(cmd.cmd).toBe('test2');
  expect(cmd.cwd).toBe('C:\\');
});

test('get a non-existing command', () => {
  expect(() => getCommand(def, 'nonExistingCommand')).toThrow();
});
