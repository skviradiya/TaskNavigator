import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Provider} from 'react-redux';
import {screens} from './constants/screens';
import MainStack from './navigation/MainStack';
import {store} from './redux/store';
import {navigationRef} from './utils/navigationRef';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import asyncAccess from './constants/asyncAccess';

export default function App() {
  const getToken = async () =>
    await AsyncStorage.getItem(asyncAccess.AUTH_TOKEN);
  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        linking={{
          prefixes: ['tasknavigator://'],
          config: {
            screens: {
              [screens.AuthStack]: 'login',
              [screens.UserStack]: {
                screens: {
                  [screens.HomeScreen]: 'home',
                  [screens.AddToDoTaskScreen]: 'create',
                  [screens.ViewTaskDetailsScreen]: 'todo/:id',
                },
              },
            },
          },
          async getInitialURL() {
            const url = await Linking.getInitialURL();
            const token = await getToken();
            if (url && !token) {
              return 'tasknavigator://login';
            }
            return url;
          },
          subscribe(listener) {
            const subscription = Linking.addEventListener(
              'url',
              async ({url}) => {
                const token = await getToken();
                if (!token) {
                  listener('tasknavigator://login');
                } else {
                  listener(url);
                }
              },
            );

            return () => {
              subscription.remove();
            };
          },
        }}>
        <MainStack />
      </NavigationContainer>
    </Provider>
  );
}
