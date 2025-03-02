import asyncAccess from '@App/constants/asyncAccess';
import colors from '@App/constants/colors';
import {screens} from '@App/constants/screens';
import {userActions} from '@App/redux/slices/userSlice';
import {useAppDispatch} from '@App/redux/store';
import {MainNavigationProps} from '@App/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

export default function SplashScreen() {
  const navigation = useNavigation<MainNavigationProps>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await AsyncStorage.getItem(asyncAccess.AUTH_TOKEN);
        dispatch(userActions.setIsAuthenticated(!!data));
        if (data) {
          navigation.replace(screens.UserStack);
        } else {
          navigation.replace(screens.AuthStack);
        }
      } catch (error) {
        navigation.replace(screens.AuthStack);
      }
    };

    setTimeout(() => {
      checkAuth();
    }, 500);
  }, [navigation, dispatch]);
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.background}
      />
      <View style={[styles.logoContainer]}>
        <Text style={styles.logo}>✓</Text>
        <Text style={styles.appName}>Task Navigator</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 60,
    color: colors.primary,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: 1,
  },
});
