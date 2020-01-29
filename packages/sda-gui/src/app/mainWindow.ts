import { BrowserWindow } from 'electron';
import { IConfig } from 'sda/lib/interfaces/IConfig';

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
  win.loadFile('app/index.html');
}
