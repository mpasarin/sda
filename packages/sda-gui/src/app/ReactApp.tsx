import { ipcRenderer, remote } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import MainComponent from './MainComponent';
import { updateConfig } from './redux/actions';
import getStore from './redux/getStore';

const config: IConfig = remote.getGlobal('sdaconfig');
const store = getStore(config);

ipcRenderer.on('response-update-config', (event, newConfig) => {
  store.dispatch(updateConfig(newConfig));
});

ReactDOM.render(
  <Provider store={store}>
    <MainComponent />
  </Provider>,
  document.getElementById('app')
);
