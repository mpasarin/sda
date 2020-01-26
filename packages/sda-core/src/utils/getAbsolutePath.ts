import * as path from 'path';

export default function getAbsolutePath(testPath: string, baseAbsolutePath: string) {
    if (!path.isAbsolute(testPath)) {
        return path.join(baseAbsolutePath, testPath);
    } else {
        return testPath;
    }
}
