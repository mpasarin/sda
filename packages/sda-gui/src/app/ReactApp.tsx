import { remote } from 'electron';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IConfig } from 'sda-core/lib/interfaces/IConfig';
import MainComponent from './MainComponent';

const config: IConfig = remote.getGlobal('sdaconfig');

ReactDOM.render(<MainComponent config={config} />, document.getElementById('app'));
