import { app, Menu, MenuItem, Tray } from 'electron';
import * as path from 'path';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import exec from 'sda/lib/utils/exec';
import getAllCommandIds from './getAllCommandIds';

export function createTray(config: IConfig): Tray {
  const tray = new Tray(path.join(__dirname, '../assets/logo24.png'));
  tray.setToolTip('SDA - Software development assistant');
  tray.setContextMenu(Menu.buildFromTemplate(getMenuItems(config)));
  return tray;
}

function getMenuItems(config: IConfig): MenuItem[] {
  const menuItems: MenuItem[] = [];

  for (const envId of Object.keys(config.environments)) {
    menuItems.push(getEnvMenuItem(config, envId));
  }

  menuItems.push(new MenuItem({ type: 'separator' }));
  menuItems.push(getAllMenuItem(config));

  menuItems.push(new MenuItem({ type: 'separator' }));
  menuItems.push(
    new MenuItem({
      label: 'Exit',
      click: () => {
        app.quit();
      },
    })
  );

  return menuItems;
}

function getEnvMenuItem(config: IConfig, envId: string): MenuItem {
  const env = config.environments[envId];
  const template = config.templates[env.templateId];
  const subItems: MenuItem[] = [];
  for (const cmdId of Object.keys(template.commands)) {
    subItems.push(
      new MenuItem({
        label: cmdId,
        click: () => {
          exec(`sda ${envId} ${cmdId}`);
        },
      })
    );
  }
  return new MenuItem({
    label: envId,
    submenu: Menu.buildFromTemplate(subItems),
  });
}

function getAllMenuItem(config: IConfig): MenuItem {
  const subItems = getAllCommandIds(config).map(
    (cmdId) =>
      new MenuItem({
        label: cmdId,
        click: () => {
          exec(`sda -a ${cmdId}`);
        },
      })
  );

  return new MenuItem({
    label: 'all',
    submenu: Menu.buildFromTemplate(subItems),
  });
}
