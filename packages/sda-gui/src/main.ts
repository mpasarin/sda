import { app } from 'electron';
import getConfig from 'sda-core/lib/config/getConfig';
import { getHomeFolder } from 'sda-core/lib/config/HomeConfig';
import { createMainWindow } from './app/mainWindow';
import { createTray } from './tray';

const cfg = getConfig(getHomeFolder()!);

// tslint:disable-next-line: no-unnecessary-initializer
let tray = undefined;

app.on('ready', () => {
  (global as any).sdaconfig = cfg;
  tray = createTray(cfg);
  createMainWindow(cfg);
});
