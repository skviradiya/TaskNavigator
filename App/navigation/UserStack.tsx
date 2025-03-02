import {screens} from '@App/constants/screens';
import AddToDoTaskScreen from '@App/screens/users/AddToDoTaskScreen';
import HomeScreen from '@App/screens/users/Home/HomeScreen';
import ViewTaskDetailsScreen from '@App/screens/users/ViewTaskDetailsScreen';
import {UserStackNavigationParams} from '@App/types/navigation';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

const Stack = createNativeStackNavigator<UserStackNavigationParams>();
function UserStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={screens.HomeScreen}>
      <Stack.Screen name={screens.HomeScreen} component={HomeScreen} />
      <Stack.Screen
        name={screens.AddToDoTaskScreen}
        component={AddToDoTaskScreen}
      />
      <Stack.Screen
        name={screens.ViewTaskDetailsScreen}
        component={ViewTaskDetailsScreen}
      />
    </Stack.Navigator>
  );
}
export default UserStack;
