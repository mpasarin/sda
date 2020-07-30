import { app, ipcMain } from 'electron';
import getConfig from 'sda/lib/config/getConfig';
import { getHomeFolder } from 'sda/lib/config/HomeConfig';
import { createMainWindow } from './mainWindow';
import { createTray } from './tray';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// tslint:disable-next-line: no-var-requires
if (require('electron-squirrel-startup')) {
  app.quit();
}

const cfg = getConfig(getHomeFolder()!);

ipcMain.on('request-update-config', (event) => {
  const newCfg = getConfig(getHomeFolder()!);
  const sortedEnvIds = Object.keys(newCfg.environments);
  event.sender.send('response-update-config', newCfg, sortedEnvIds);
});

// tslint:disable-next-line: no-unnecessary-initializer
let tray = undefined;

app.on('ready', () => {
  (global as any).sdaconfig = cfg;
  tray = createTray(cfg);
  createMainWindow();
});
