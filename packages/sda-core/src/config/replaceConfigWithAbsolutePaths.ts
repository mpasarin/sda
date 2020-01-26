
import * as path from 'path';
import { IConfig, IConfigCommand } from '../interfaces/IConfig';
import getAbsolutePath from '../utils/getAbsolutePath';

/**
 * Replaces all relative paths in a config file with absolute paths.
 * This includes environment paths and file paths directories.
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
                if (command.filePath) {
                    command.filePath = getAbsolutePath(command.filePath, dir);
                }
            });
        });
    }
    return config;
}
