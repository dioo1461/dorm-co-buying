/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import React from 'react';
import {ThemeProvider} from 'styled-components';
import theme from 'styles/theme';

const ProvidedNavigator = () => {
  return (
    <ThemeProvider theme={{...theme}}>
      <App />
    </ThemeProvider>
  );
};

AppRegistry.registerComponent(appName, () => App);
