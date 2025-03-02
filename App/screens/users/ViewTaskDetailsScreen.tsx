import {
  completeIcon,
  deleteIcon,
  pencilIcon,
  pendingIcon,
} from '@App/assets/icons';
import CTGradientBackground from '@App/components/common/CTGradientBackground';
import CTHeader from '@App/components/common/CTHeader';
import CTIcon from '@App/components/common/CTIcon';
import colors from '@App/constants/colors';
import {ITEM_BORDER_RADIUS} from '@App/constants/constants';
import {screens} from '@App/constants/screens';
import {
  UserNavigationProps,
  UserStackNavigationParams,
} from '@App/types/navigation';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CTConfirmationPopUp from '@App/components/common/CTConfirmationPopUp';
import {useAppDispatch} from '@App/redux/store';
import {userActions} from '@App/redux/slices/userSlice';
import CTLoader from '@App/components/common/CTLoader';
import commonStyles from '@App/styles/commonStyles';
import {ITodoListItem} from '@App/types/slice/userSlice';
import {NETWORK_ERROR} from '@App/constants/ErrorMessage';

type ViewTaskDetailsScreenRouteProp = RouteProp<
  UserStackNavigationParams,
  screens.ViewTaskDetailsScreen
>;

export default function ViewTaskDetailsScreen() {
  const route = useRoute<ViewTaskDetailsScreenRouteProp>();
  const navigation = useNavigation<UserNavigationProps>();
  const [detailsItem, setDetailsItem] = useState<ITodoListItem | null>(
    route.params.item || null,
  );
  const taskId = route.params?.id;

  const isComplete = detailsItem?.status === 'completed';
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onPressDelete = () => {
    if (!detailsItem) {
      return;
    }
    setIsLoading(true);
    dispatch(userActions.deleteTask(detailsItem.id))
      .unwrap()
      .then(() => {
        goBack();
      })
      .catch(error => {
        if (error === NETWORK_ERROR) {
          goBack();
        } else {
          console.log('Error deleting task:', error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    if (route.params.item) {
      setDetailsItem(route.params.item);
    }
  }, [route.params.item]);
  useEffect(() => {
    if (!detailsItem && taskId) {
      const getTaskDetails = async () => {
        try {
          setIsLoading(true);
          setErrorMessage('');

          const data = await dispatch(
            userActions.getTaskDetailsByID(taskId),
          ).unwrap();
          setDetailsItem(data);
        } catch (error) {
          console.log('Error getting task details:', error);
          setErrorMessage(error as string);
        } finally {
          setIsLoading(false);
        }
      };
      getTaskDetails();
    }
  }, [detailsItem, taskId, dispatch]);
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
      <CTHeader title={'Task Details'} onBackPress={goBack} />

      <View style={styles.contentContainer}>
        {detailsItem ? (
          <View style={[styles.taskCard, commonStyles.shadowStyle]}>
            <View style={styles.statusContainer}>
              <CTIcon
                source={isComplete ? completeIcon : pendingIcon}
                tintColor={isComplete ? colors.success : colors.warning}
                disabled
              />
              <Text
                style={[
                  styles.statusText,
                  {color: isComplete ? colors.success : colors.warning},
                ]}>
                {detailsItem?.status}
              </Text>
            </View>
            <Text style={styles.dateStyle}>
              {detailsItem?.due_on
                ? new Date(detailsItem?.due_on).toLocaleDateString('en-GB')
                : ''}
            </Text>
            <Text style={styles.titleText}>{detailsItem?.title}</Text>
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>{errorMessage}</Text>
          </View>
        )}
      </View>
      {detailsItem && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(screens.AddToDoTaskScreen, {
                item: detailsItem,
              });
            }}
            style={styles.addButton}>
            <CTIcon
              source={pencilIcon}
              iconSize={25}
              disabled
              tintColor={colors.textPrimary}
            />
          </TouchableOpacity>
          <View style={styles.buttonSpacing} />
          <TouchableOpacity
            style={[styles.addButton, styles.deleteButton]}
            onPress={() => setShowDeleteConfirmation(true)}>
            <CTIcon
              source={deleteIcon}
              iconSize={25}
              disabled
              tintColor={colors.error}
            />
          </TouchableOpacity>
        </View>
      )}
      <CTConfirmationPopUp
        isVisible={showDeleteConfirmation}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        onConfirm={onPressDelete}
        onCancel={() => setShowDeleteConfirmation(false)}
        confirmText="Delete"
        confirmButtonStyle={{backgroundColor: colors.error}}
      />
      <CTLoader isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusText: {
    marginLeft: 10,
  },

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
  deleteButton: {
    backgroundColor: colors.textPrimary,
  },
  dateStyle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginVertical: 10,
  },
  contentContainer: {
    padding: 20,
    flex: 1,
  },
  taskCard: {
    borderColor: colors.border,
    borderWidth: 1,
    backgroundColor: colors.background,
    borderRadius: ITEM_BORDER_RADIUS,
    padding: 20,
    marginBottom: 10,
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: 20,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noDataText: {
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
