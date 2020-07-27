import { app } from 'electron';
import { update } from 'lodash';
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

// tslint:disable-next-line: no-unnecessary-initializer
let tray = undefined;

app.on('ready', () => {
  (global as any).sdaconfig = cfg;
  (global as any).updateConfig =  () => {
    const newCfg = getConfig(getHomeFolder()!);
    (global as any).sdaconfig = newCfg;
  };
  tray = createTray(cfg);
  createMainWindow(cfg);
});
