import { BrowserWindow } from 'electron';
import { IConfig } from 'sda/lib/interfaces/IConfig';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;

export function createMainWindow(config: IConfig) {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}
