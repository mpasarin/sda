import { IConfig, IConfigCommand } from '../interfaces/IConfig';
import Log from '../Log';
import replaceConfigWithAbsolutePaths from './replaceConfigWithAbsolutePaths';

const path = 'C:\\A\\B\\C\\sdaconfig.json';

beforeAll(() => {
  Log.isEnabled = false;
});

describe('environment paths', () => {
  test('replace environment with relative path', () => {
    const config: Partial<IConfig> = {
      environments: {
        test: {
          templateId: 'testTemplate',
          path: '..'
        }
      }
    };
    const result = replaceConfigWithAbsolutePaths(config, path);
    expect(result.environments).toBeDefined();
    expect(result.environments!).toHaveProperty('test');
    expect(result.environments!.test.path).toBe('C:\\A\\B');
  });

  test('replace environment with absolute path', () => {
    const config: Partial<IConfig> = {
      environments: {
        test: {
          templateId: 'testTemplate',
          path: 'D:\\TEST'
        }
      }
    };
    const result = replaceConfigWithAbsolutePaths(config, path);
    expect(result.environments).toBeDefined();
    expect(result.environments!).toHaveProperty('test');
    expect(result.environments!.test.path).toBe('D:\\TEST');
  });
});

describe('commands with filepath', () => {
  test('replace command filepath with relative path', () => {
    const config: Partial<IConfig> = {
      templates: {
        test: {
          commands: {
            testCmd: {
              filePath: '../test_script'
            }
          }
        }
      }
    };
    const result = replaceConfigWithAbsolutePaths(config, path);
    expect(result.templates).toBeDefined();
    expect(result.templates!).toHaveProperty('test');
    expect(result.templates!.test.commands).toHaveProperty('testCmd');
    expect(result.templates!.test.commands.testCmd).toHaveProperty('filePath');
    expect((result.templates!.test.commands.testCmd as IConfigCommand).filePath).toBe('C:\\A\\B\\test_script');
  });

  test('replace command cwd with absolute path', () => {
    const config: Partial<IConfig> = {
      templates: {
        test: {
          commands: {
            testCmd: {
              filePath: 'D:\\test_script'
            }
          }
        }
      }
    };
    const result = replaceConfigWithAbsolutePaths(config, path);
    expect(result.templates).toBeDefined();
    expect(result.templates!).toHaveProperty('test');
    expect(result.templates!.test.commands).toHaveProperty('testCmd');
    expect(result.templates!.test.commands.testCmd).toHaveProperty('filePath');
    expect((result.templates!.test.commands.testCmd as IConfigCommand).filePath).toBe('D:\\test_script');
  });
});

describe('other commands', () => {
  test('does nothing with string commands', () => {
    const config: Partial<IConfig> = {
      templates: {
        test: {
          commands: {
            testCmd: 'echo TEST'
          }
        }
      }
    };
    const result = replaceConfigWithAbsolutePaths(config, path);
    expect(result.templates).toBeDefined();
    expect(result.templates!).toHaveProperty('test');
    expect(result.templates!.test.commands).toHaveProperty('testCmd');
    expect(result.templates!.test.commands.testCmd).toBe('echo TEST');
  });

  test('does nothing with array commands', () => {
    const config: Partial<IConfig> = {
      templates: {
        test: {
          commands: {
            testCmd: ['echo TEST', 'echo ANOTHER TEST']
          }
        }
      }
    };
    const result = replaceConfigWithAbsolutePaths(config, path);
    expect(result.templates).toBeDefined();
    expect(result.templates!).toHaveProperty('test');
    expect(result.templates!.test.commands).toHaveProperty('testCmd');
    expect(result.templates!.test.commands.testCmd).toHaveLength(2);
  });
});
