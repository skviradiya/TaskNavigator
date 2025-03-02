import AsyncStorage from '@react-native-async-storage/async-storage';

const generateCacheKey = (
  url: string,
  params?: Record<string, any>,
): string => {
  return `${url}?${JSON.stringify(params || {})}`;
};

const getCachedResponse = async (key: string): Promise<any | null> => {
  console.log('🚀 ~ getCachedResponse ~ key:', key);
  try {
    const cachedData = await AsyncStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error('Error retrieving cached response:', error);
    return null;
  }
};
const setCacheResponse = async (key: string, data: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching response:', error);
  }
};
const cacheFunc = {generateCacheKey, getCachedResponse, setCacheResponse};

export default cacheFunc;
