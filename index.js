/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './App/axios/api';

AppRegistry.registerComponent(appName, () => App);
