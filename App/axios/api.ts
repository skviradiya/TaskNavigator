import asyncAccess from '@App/constants/asyncAccess';
import {screens} from '@App/constants/screens';
import {userActions} from '@App/redux/slices/userSlice';
import {store} from '@App/redux/store';
import cacheFunc from '@App/utils/cacheFunc';
import {navigate} from '@App/utils/navigationRef';
import {isNetworkAvailable} from '@App/utils/networkFunc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

axios.defaults.baseURL = 'https://gorest.co.in/public/v2/';
axios.defaults.timeout = 5000;

axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem(asyncAccess.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      'token:',
      config.headers.Authorization,
      '\n-- Method:',
      config.method,
      '\n-- URL:',
      config.url,
      '\n-- Params',
      config.params,
      '\n-- Request',
      config.data,
    );
    const isNetwork = await isNetworkAvailable();
    if (!isNetwork && config.method === 'get') {
      const cacheKey = cacheFunc.generateCacheKey(
        config.url || '',
        config.params,
      );
      const cachedResponse = await cacheFunc.getCachedResponse(cacheKey);

      if (cachedResponse) {
        return Promise.reject({
          isCache: true,
          response: cachedResponse,
        });
      }
    }

    return config;
  },
  error => {
    console.log('Request Error:', error);
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  async response => {
    if (response.config.method === 'get') {
      const cacheKey = cacheFunc.generateCacheKey(
        response.config.url || '',
        response.config.params,
      );
      await cacheFunc.setCacheResponse(cacheKey, response);
    }
    return response;
  },
  async error => {
    console.log('Response Error:', error.config);

    if (error.code === 401) {
      await AsyncStorage.clear();
      navigate(screens.AuthStack);
      store.dispatch(userActions.reset());
    }
    if (error.isCache) {
      return Promise.resolve(error.response);
    }

    return Promise.reject(error);
  },
);

export default axios;
