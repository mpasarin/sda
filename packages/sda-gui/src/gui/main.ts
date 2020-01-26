import * as child_process from 'child_process';
import { app, Menu, MenuItem, Tray } from 'electron';
import getConfig from 'sda-core/lib/config/getConfig';
import { getHomeFolder } from 'sda-core/lib/config/HomeConfig';
import { IConfig } from 'sda-core/lib/interfaces/IConfig';
import * as util from 'util';
const exec = util.promisify(child_process.exec);

const cfg = getConfig(getHomeFolder()!);

let tray = null;
app.on('ready', () => {
  tray = new Tray('assets/logo24.png');
  tray.setToolTip('SDA - Software development assistant');
  tray.setContextMenu(Menu.buildFromTemplate(getMenuItems(cfg)));
});

function getMenuItems(config: IConfig): MenuItem[] {
  const menuItems: MenuItem[] = [];

  for (const envId of Object.keys(config.environments)) {
    menuItems.push(getEnvMenuItem(config, envId));
  }

  menuItems.push(new MenuItem({ type: 'separator' }));
  menuItems.push(getAllMenuItem(config));

  menuItems.push(new MenuItem({ type: 'separator' }));
  menuItems.push(new MenuItem({ label: 'Exit', click: () => { app.quit(); } }));

  return menuItems;
}

function getEnvMenuItem(config: IConfig, envId: string): MenuItem {
  const env = config.environments[envId];
  const template = config.templates[env.templateId];
  const subItems: MenuItem[] = [];
  for (const cmdId of Object.keys(template.commands)) {
    subItems.push(new MenuItem({
      label: cmdId,
      click: () => {
        exec(`sda ${envId} ${cmdId}`);
      }
    }));
  }
  return new MenuItem({ label: envId, submenu: Menu.buildFromTemplate(subItems) });
}

function getAllMenuItem(config: IConfig): MenuItem {
  const subItems: MenuItem[] = [];
  const allCmdIds: Set<string> = new Set();

  for (const templateId of Object.keys(config.templates)) {
    const template = config.templates[templateId];
    for (const cmdId of Object.keys(template.commands)) {
      allCmdIds.add(cmdId);
    }
  }

  allCmdIds.forEach((cmdId) => {
    subItems.push(new MenuItem({
      label: cmdId,
      click: () => {
        exec(`sda -a ${cmdId}`);
      }
    }));
  });

  return new MenuItem({ label: 'all', submenu: Menu.buildFromTemplate(subItems) });
}
