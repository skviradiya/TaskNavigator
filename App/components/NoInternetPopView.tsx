import colors from '@App/constants/colors';
import React, {memo, useEffect, useRef, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {View, Text, StyleSheet, StatusBar, SafeAreaView} from 'react-native';
import {processQueue} from '@App/axios/offlineQueue';

function NoInternetPopView() {
  const [isConnected, setIsConnected] = useState(true);
  const lastIsConnected = useRef<boolean | null>(null); // Store the last connectivity state

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (lastIsConnected.current !== state.isConnected) {
        lastIsConnected.current = state.isConnected ?? false;
        setIsConnected(state.isConnected ?? false);
        if (state.isConnected) {
          processQueue();
        }
      }
    });

    return () => unsubscribe();
  }, []);
  if (isConnected) {
    return null;
  }
  return (
    <View style={styles.noInternetContainer}>
      <SafeAreaView />
      <StatusBar backgroundColor={colors.error} barStyle={'light-content'} />
      <Text style={styles.noInternetText}>No Internet Connection</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noInternetContainer: {
    backgroundColor: colors.error,
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    width: '100%',
  },
  noInternetText: {
    color: colors.textPrimary,
    margin: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default memo(NoInternetPopView);
