import getParams from './getParams';
import Log from './Log';

beforeAll(() => {
  Log.isEnabled = false;
});

test('returns empty array when empty args array passed', () => {
    const args: string[] = [];
    const result = getParams(args);
    expect(result).toEqual([]);
});

test('recognizes params starting with -', () => {
    const args = ['arg1', 'arg2', '-param'];
    const result = getParams(args);
    expect(result).toEqual([['-param']]);
});

test('recognizes params starting with /', () => {
    const args = ['arg1', 'arg2', '/p'];
    const result = getParams(args);
    expect(result).toEqual([['/p']]);
});

test('recognizes multiple params', () => {
    const args = ['arg1', 'arg2', '-param', '/p'];
    const result = getParams(args);
    expect(result).toEqual([['-param'], ['/p']]);
});

test('groups params with values', () => {
    const args = ['arg1', 'arg2', '-param', 'paramValue', '-a'];
    const result = getParams(args);
    expect(result).toEqual([['-param', 'paramValue'], ['-a']]);
});

test('removes params from args list', () => {
    const args = ['arg1', 'arg2', 'arg3', '-param', 'paramValue'];
    getParams(args);
    expect(args).toEqual(['arg1', 'arg2', 'arg3']);
});
