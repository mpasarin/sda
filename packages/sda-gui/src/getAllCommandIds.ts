import { IConfig } from 'sda/lib/interfaces/IConfig';

export default function getAllCommandIds(config: IConfig): string[] {
  const allCmdIds: Set<string> = new Set();
  for (const templateId of Object.keys(config.templates)) {
    const template = config.templates[templateId];
    for (const cmdId of Object.keys(template.commands)) {
      allCmdIds.add(cmdId);
    }
  }
  return Array.from(allCmdIds);
}
