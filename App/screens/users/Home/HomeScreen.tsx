import CTGradientBackground from '@App/components/common/CTGradientBackground';
import CTHeader from '@App/components/common/CTHeader';
import CTLoader from '@App/components/common/CTLoader';
import {userActions} from '@App/redux/slices/userSlice';
import {useAppDispatch} from '@App/redux/store';
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import SideButtonsView from './SideButtonsView';
import ToDoListView from './ToDoListView';
import {getQueue} from '@App/axios/offlineQueue';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getQueue().then(data => {
      console.log('🚀 ~ getQueue ~ data:', data);
    });
    setIsLoading(true);
    dispatch(userActions.toDoList())
      .unwrap()
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <CTGradientBackground />
      <CTHeader title="To-Do List" titleStyle={styles.headerTitle} />
      <ToDoListView />
      <SideButtonsView />
      <CTLoader isVisible={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    textAlign: 'left',
    fontSize: 20,
  },
});
