import {addIcon, logoutIcon} from '@App/assets/icons';
import CTConfirmationPopUp from '@App/components/common/CTConfirmationPopUp';
import CTIcon from '@App/components/common/CTIcon';
import colors from '@App/constants/colors';
import {screens} from '@App/constants/screens';
import {userActions} from '@App/redux/slices/userSlice';
import {useAppDispatch} from '@App/redux/store';
import {RootStackNavigationProps} from '@App/types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {memo, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

function SideButtonsView() {
  const navigation = useNavigation<RootStackNavigationProps>();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const dispatch = useAppDispatch();

  const onPressLogout = async () => {
    setShowLogoutConfirmation(false);

    try {
      await AsyncStorage.clear();
      dispatch(userActions.reset());
      navigation.navigate(screens.AuthStack);
    } catch (error) {
      console.log('🚀 ~ onPressLogout ~ error:', error);
    }
  };

  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate(screens.AddToDoTaskScreen)}
          style={styles.addButton}>
          <CTIcon
            source={addIcon}
            iconSize={25}
            disabled
            tintColor={colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.buttonSpacing} />
        <TouchableOpacity
          onPress={() => setShowLogoutConfirmation(true)}
          style={[styles.addButton, styles.logoutButton]}>
          <CTIcon
            source={logoutIcon}
            iconSize={25}
            disabled
            tintColor={colors.error}
          />
        </TouchableOpacity>
      </View>

      <CTConfirmationPopUp
        isVisible={showLogoutConfirmation}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={onPressLogout}
        onCancel={() => setShowLogoutConfirmation(false)}
        confirmText="Logout"
        confirmButtonStyle={{backgroundColor: colors.error}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    padding: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  buttonSpacing: {
    height: 20,
  },
  logoutButton: {
    backgroundColor: colors.textPrimary,
  },
});
export default memo(SideButtonsView);
