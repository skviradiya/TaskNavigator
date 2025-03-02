import CTButton from '@App/components/common/CTButton';
import CTGradientBackground from '@App/components/common/CTGradientBackground';
import CTKeyboardAvoidScrollView from '@App/components/common/CTKeyboardAvoidScrollView';
import CTLoader from '@App/components/common/CTLoader';
import CTTextInput from '@App/components/common/CTTextInput';
import asyncAccess from '@App/constants/asyncAccess';
import colors from '@App/constants/colors';
import {screens} from '@App/constants/screens';
import {verifyToken} from '@App/redux/slices/userSlice';
import {useAppDispatch} from '@App/redux/store';
import {MainNavigationProps} from '@App/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

export default function LoginTokenScreen() {
  const navigation = useNavigation<MainNavigationProps>();
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const dispatch = useAppDispatch();

  const onPressVerify = async () => {
    setIsLoading(true);
    setAuthErrorMessage('');
    try {
      await dispatch(verifyToken({token: token})).unwrap();
      await AsyncStorage.setItem(asyncAccess.AUTH_TOKEN, token);
      setTimeout(() => {
        navigation.replace(screens.UserStack);
      }, 300);
    } catch (e: any) {
      console.log(e);
      setAuthErrorMessage(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <CTGradientBackground />
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={colors.background}
      />
      <CTKeyboardAvoidScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.titleText}>Welcome</Text>
          <CTTextInput
            label="Enter GoRest token"
            value={token}
            onChangeText={setToken}
            autoCapitalize="none"
          />
          {authErrorMessage ? (
            <Text style={styles.errorMessage}>{authErrorMessage}</Text>
          ) : null}
          <CTButton
            title="Verify Token"
            onPress={onPressVerify}
            disabled={!token}
            style={{marginTop: 20, opacity: token ? 1 : 0.5}}
          />
        </View>
      </CTKeyboardAvoidScrollView>
      <CTLoader isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: '10%',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  errorMessage: {
    color: colors.warning,
    fontSize: 11,
    marginLeft: 10,
  },
});
