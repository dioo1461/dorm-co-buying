/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

import React from 'react'
import { ThemeProvider } from 'styled-components'
import theme from 'styles/theme'
import * as encoding from 'text-encoding'
import { decode } from 'base-64'
global.atob = decode

const ProvidedNavigator = () => {
    return (
        <ThemeProvider theme={{ ...theme }}>
            <App />
        </ThemeProvider>
    )
}
if (__DEV__) {
    import('./reactotron.config').then(() =>
        console.log('Reactotron Configured'),
    )
}
AppRegistry.registerComponent(appName, () => App)
