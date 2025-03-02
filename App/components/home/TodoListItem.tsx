import {completeIcon, pendingIcon, syncIcon} from '@App/assets/icons';
import colors from '@App/constants/colors';
import {ITodoListItem} from '@App/types/slice/userSlice';
import React, {memo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import CTIcon from '../common/CTIcon';
import {useNavigation} from '@react-navigation/native';
import {UserNavigationProps} from '@App/types/navigation';
import {screens} from '@App/constants/screens';
import commonStyles from '@App/styles/commonStyles';
import {ITEM_BORDER_RADIUS} from '@App/constants/constants';

function TodoListItem({item}: {item: ITodoListItem}) {
  const navigation = useNavigation<UserNavigationProps>();
  const isComplete = item.status === 'completed';
  return (
    <TouchableOpacity
      style={[styles.itemContainer, commonStyles.shadowStyle]}
      onPress={() => {
        navigation.navigate(screens.ViewTaskDetailsScreen, {item});
      }}>
      <Text style={styles.itemTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.dateStyle}>
        {new Date(item.due_on).toLocaleDateString('en-GB')}
      </Text>

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
          {item.status}
        </Text>
      </View>
      {item.offlineOperation && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <CTIcon
            source={syncIcon}
            tintColor={colors.textSecondary}
            disabled
            iconSize={10}
          />
          <Text
            style={{fontSize: 12, color: colors.textSecondary, marginLeft: 10}}>
            will {item.offlineOperation} on server
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
export default memo(TodoListItem);
const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    padding: 16,
    borderRadius: ITEM_BORDER_RADIUS,
    backgroundColor: colors.background,
  },
  itemTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 10,
  },
  dateStyle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
});
