import {verifyToken} from '@App/redux/slices/userSlice';
import {store} from '@App/redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {InternalAxiosRequestConfig} from 'axios';

const QUEUE_KEY = 'offline_request_queue';

export const addToQueue = async (config: InternalAxiosRequestConfig) => {
  try {
    const queue = await getQueue();

    const newId =
      config.method === 'post'
        ? JSON.parse(config.data).due_on
        : config.url?.split('/').pop();

    const index = queue.findIndex((item: InternalAxiosRequestConfig) => {
      const id =
        item.method === 'post'
          ? JSON.parse(item.data).due_on
          : item.url?.split('/').pop();
      return id === newId;
    });

    if (config.method === 'delete' && index !== -1) {
      queue.splice(index, 1);
    } else if (index !== -1) {
      queue[index] = config;
    } else {
      queue.push(config);
    }

    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding request to queue:', error);
  }
};

export const getQueue = async (): Promise<any[]> => {
  try {
    const queueData = await AsyncStorage.getItem(QUEUE_KEY);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error('Error fetching queue:', error);
    return [];
  }
};

const getUserIDForPostApi = async () => {
  try {
    const data = await store.dispatch(verifyToken()).unwrap();
    return data[0].id;
  } catch (error) {
    return 0;
  }
};
export const processQueue = async () => {
  const queue = (await getQueue()) as InternalAxiosRequestConfig[];

  const isPostApiFound = queue.some(item => item.method === 'post');
  let user_id;
  if (isPostApiFound) {
    user_id = await getUserIDForPostApi();
  }

  for (const request of queue) {
    try {
      if (request.method === 'post' && user_id) {
        await axios.post(request.url || '', {
          data: {
            ...request.data,
            user_id: user_id,
          },
        });
      } else if (request.method === 'delete') {
        await axios.delete(request.url || '', {params: request.params});
      } else if (request.method === 'put') {
        await axios.put(request.url || '', request.data);
      }
    } catch (error) {
      console.error(error || 'An error occurred');
    }
  }
  await AsyncStorage.removeItem(QUEUE_KEY);
};
