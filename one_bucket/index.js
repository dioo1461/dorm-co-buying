/**
 * @format
 */

import initializeFcm from '@/utils/initializeFcm'
import { decode } from 'base-64'
import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
global.atob = decode

initializeFcm()

if (__DEV__) {
    import('./reactotron.config').then(() =>
        console.log('Reactotron Configured'),
    )
}
AppRegistry.registerComponent(appName, () => App)
