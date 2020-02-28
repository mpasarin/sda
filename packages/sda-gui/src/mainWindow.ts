import { BrowserWindow } from 'electron';
import * as path from 'path';
import { IConfig } from 'sda/lib/interfaces/IConfig';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

export function createMainWindow(config: IConfig) {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: path.join(__dirname, '../assets/logo24.png')
  });

  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}
