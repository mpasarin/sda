import { ipcRenderer, remote } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IConfig, IConfigEnvironment } from 'sda/lib/interfaces/IConfig';
import MainComponent from './MainComponent';
import { updateConfig } from './redux/actions';
import getStore from './redux/getStore';

const config: IConfig = remote.getGlobal('sdaconfig');
const store = getStore(config);

ipcRenderer.on('response-update-config', (event, newConfig: IConfig, sortedEnvIds: string[]) => {
  const sortedEnvs: {[id: string]: IConfigEnvironment} = {};
  sortedEnvIds.forEach((envId) => {
    sortedEnvs[envId] = newConfig.environments[envId];
  });
  newConfig.environments = sortedEnvs;

  store.dispatch(updateConfig(newConfig));
});

document.addEventListener('keydown', (event) => {
  if (event.which === 123) { // F12
    remote.getCurrentWebContents().toggleDevTools();
  } else if (event.which === 116) { // F5
    location.reload();
  }
});

ReactDOM.render(
  <Provider store={store}>
    <MainComponent />
  </Provider>,
  document.getElementById('app')
);
