import {completeIcon, pendingIcon} from '@App/assets/icons';
import CTButton from '@App/components/common/CTButton';
import CTGradientBackground from '@App/components/common/CTGradientBackground';
import CTHeader from '@App/components/common/CTHeader';
import CTIcon from '@App/components/common/CTIcon';
import CTKeyboardAvoidScrollView from '@App/components/common/CTKeyboardAvoidScrollView';
import CTLoader from '@App/components/common/CTLoader';
import CTTextInput from '@App/components/common/CTTextInput';
import colors from '@App/constants/colors';
import {ITEM_BORDER_RADIUS} from '@App/constants/constants';
import {NETWORK_ERROR} from '@App/constants/ErrorMessage';
import {screens} from '@App/constants/screens';
import {userActions} from '@App/redux/slices/userSlice';
import {useAppDispatch} from '@App/redux/store';
import commonStyles from '@App/styles/commonStyles';
import {
  UserNavigationProps,
  UserStackNavigationParams,
} from '@App/types/navigation';
import {OfflineOperationType} from '@App/types/network';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

type AddToDoTaskScreenRouteProp = RouteProp<
  UserStackNavigationParams,
  screens.AddToDoTaskScreen
>;
export default function AddToDoTaskScreen() {
  const route = useRoute<AddToDoTaskScreenRouteProp>();
  const navigation = useNavigation<UserNavigationProps>();
  const detailsItem = route.params?.item;
  const [title, setTitle] = useState(detailsItem?.title || '');
  const [status, setStatus] = useState(detailsItem?.status || 'pending');
  const dispatch = useAppDispatch();
  const statusData = [
    {
      icon: completeIcon,
      title: 'completed',
      color: colors.success,
    },
    {
      icon: pendingIcon,
      title: 'pending',
      color: colors.warning,
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getUserID = async () => {
    try {
      const data = await dispatch(userActions.verifyToken()).unwrap();
      return data[0].id;
    } catch (error) {
      return 0;
    }
  };

  const onPressSubmit = async () => {
    if (!title.trim()) {
      setErrorMessage('Please enter a title');
      return false;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      if (
        detailsItem?.id &&
        detailsItem?.offlineOperation === OfflineOperationType.update
      ) {
        await dispatch(
          userActions.updateTask({
            id: detailsItem.id,
            title,
            status,
            due_on: detailsItem.due_on,
            user_id: detailsItem.user_id,
          }),
        ).unwrap();

        navigation.popTo(screens.ViewTaskDetailsScreen, {
          item: {
            ...detailsItem,
            title,
            status,
          },
        });
      } else {
        const user_id = await getUserID();
        await dispatch(
          userActions.createTask({
            title,
            status,
            due_on: detailsItem?.offlineOperation
              ? detailsItem.due_on
              : new Date().toISOString(),
            user_id,
          }),
        ).unwrap();
        navigation.goBack();
      }
    } catch (error: any) {
      if (error === NETWORK_ERROR && detailsItem?.id) {
        navigation.popTo(screens.ViewTaskDetailsScreen, {
          item: {
            ...detailsItem,
            title,
            status,
          },
        });
      } else if (error === NETWORK_ERROR) {
        navigation.goBack();
      } else {
        setErrorMessage(
          error?.message ||
            `Failed to ${detailsItem ? 'update' : 'create'} task`,
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  const goBack = () => {
    if (!navigation.canGoBack()) {
      navigation.replace(screens.HomeScreen);
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={styles.container}>
      <CTGradientBackground />
      <CTHeader
        title={`${detailsItem ? 'Update' : 'Add'} Task`}
        onBackPress={goBack}
      />
      <CTKeyboardAvoidScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <CTTextInput
              label="Title"
              multiline
              value={title}
              onChangeText={text => {
                setTitle(text);
                setErrorMessage('');
              }}
              errorMessage={errorMessage}
            />
            <View style={{height: 10}} />

            <View style={[styles.statusContainer, commonStyles.shadowStyle]}>
              <Text style={styles.statusLabel}>Status:</Text>
              {statusData.map(item => {
                const isSelected = item.title === status;
                return (
                  <TouchableOpacity
                    key={item.title}
                    onPress={() => setStatus(item.title)}
                    style={styles.statusRow}>
                    <CTIcon
                      disabled
                      source={item.icon}
                      tintColor={item.color}
                    />

                    <Text style={[styles.statusText, {color: item.color}]}>
                      {item.title}
                    </Text>
                    <View style={styles.flex} />
                    <View style={styles.radioButton}>
                      {isSelected && (
                        <View style={styles.radioButtonSelected} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <CTButton
            title={detailsItem ? 'Update To-do Task' : 'Add To-do Task'}
            onPress={onPressSubmit}
            disabled={!title.trim()}
            style={{opacity: title.trim() ? 1 : 0.5}}
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
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statusContainer: {
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.background,
    borderRadius: ITEM_BORDER_RADIUS,
    padding: 20,
    marginBottom: 10,
  },
  statusLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statusText: {
    marginLeft: 10,
  },
  flex: {
    flex: 1,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    width: 22,
    height: 22,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 100,
  },
});
