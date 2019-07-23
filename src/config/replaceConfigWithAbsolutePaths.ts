
import * as path from 'path';
import { IConfig, IConfigCommand } from '../interfaces/IConfig';

/**
 * Replaces all relative paths in a config file with absolute paths.
 * This includes environment paths, command working directories.
 */
export default function replaceConfigWithAbsolutePaths(
    config: Partial<IConfig>,
    configFilePath: string
): Partial<IConfig> {
    const dir = path.parse(configFilePath).dir;
    if (config.environments) {
        for (const key of Object.keys(config.environments)) {
            const env = config.environments[key];
            env.path = getAbsolutePath(env.path, dir);
        }
    }
    if (config.templates) {
        Object.keys(config.templates).forEach((templateId) => {
            const template = config.templates![templateId];
            Object.keys(template.commands).forEach((commandId) => {
                const command: IConfigCommand = template.commands[commandId] as IConfigCommand;
                if (command.cwd) {
                    command.cwd = getAbsolutePath(command.cwd, dir);
                }
            });
        });
    }
    return config;
}

function getAbsolutePath(testPath: string, baseAbsolutePath: string) {
    if (!path.isAbsolute(testPath)) {
        return path.join(baseAbsolutePath, testPath);
    } else {
        return testPath;
    }
}
