/**
 * @format
 */

import 'react-native-gesture-handler'; // 반드시 최상단에 위치
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
