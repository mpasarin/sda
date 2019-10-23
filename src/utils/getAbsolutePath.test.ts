import * as path from 'path';
import getAbsolutePath from './getAbsolutePath';

test('getAbsolutePath with an absolute path', () => {
    const pathToTest = 'C:\\testA\\testB';
    const basePath = 'D:\\a\\b';
    const res = getAbsolutePath(pathToTest, basePath);
    expect(res).toEqual(pathToTest);
});

test('getAbsolutePath with a relative path', () => {
    const pathToTest = 'testA\\testB';
    const basePath = 'D:\\a\\b';
    const res = getAbsolutePath(pathToTest, basePath);
    expect(res).toEqual(path.join(basePath, pathToTest));
});
