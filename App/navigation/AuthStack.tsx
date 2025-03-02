import {screens} from '@App/constants/screens';
import LoginTokenScreen from '@App/screens/auth/LoginTokenScreen';
import {AuthStackNavigationParams} from '@App/types/navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator<AuthStackNavigationParams>();
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name={screens.LoginTokenScreen}
        component={LoginTokenScreen}
      />
    </Stack.Navigator>
  );
}
export default AuthStack;
