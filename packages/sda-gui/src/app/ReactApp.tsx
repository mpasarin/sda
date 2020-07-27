import { remote } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { IConfig } from 'sda/lib/interfaces/IConfig';
import MainComponent from './MainComponent';
import getStore from './redux/getStore';

const config: IConfig = remote.getGlobal('sdaconfig');
const store = getStore(config);

ReactDOM.render(
  <Provider store={store}>
    <MainComponent />
  </Provider>,
  document.getElementById('app')
);
