import {screens} from '@App/constants/screens';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ITodoListItem} from './slice/userSlice';

export type RootStackParams = {
  [K in screens]: undefined;
};
export type RootStackNavigationProps =
  NativeStackNavigationProp<RootStackParams>;

export type MainStackNavigationParams = {
  [screens.SplashScreen]: undefined;
  [screens.AuthStack]: undefined;
  [screens.UserStack]: undefined;
};

export type MainNavigationProps =
  NativeStackNavigationProp<MainStackNavigationParams>;

export type AuthStackNavigationParams = {
  [screens.LoginTokenScreen]: undefined;
};

export type AuthNavigationProps =
  NativeStackNavigationProp<AuthStackNavigationParams>;

export type UserStackNavigationParams = {
  [screens.HomeScreen]: undefined;
  [screens.AddToDoTaskScreen]: {item?: ITodoListItem} | undefined;
  [screens.ViewTaskDetailsScreen]: {
    item?: ITodoListItem;
    id?: number | string;
  };
};

export type UserNavigationProps =
  NativeStackNavigationProp<UserStackNavigationParams>;
