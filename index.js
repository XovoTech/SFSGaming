/**
 * @format
 */

import React, {Component} from 'react';
import {AppRegistry, LogBox} from 'react-native';
import {Provider} from 'react-redux';
import {createReduxStore} from './src/store';
import App from './src/App';
import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const store = createReduxStore();
const queryClient = new QueryClient();

LogBox.ignoreAllLogs();
enableScreens();

class StoreApp extends Component {
  render() {
    return (
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </QueryClientProvider>
    );
  }
}

AppRegistry.registerComponent(appName, () => StoreApp);
