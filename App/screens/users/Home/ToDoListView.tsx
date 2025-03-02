import TodoListItem from '@App/components/home/TodoListItem';
import colors from '@App/constants/colors';
import {userActions} from '@App/redux/slices/userSlice';
import {useAppDispatch, useAppSelector} from '@App/redux/store';
import {ITodoListItem} from '@App/types/slice/userSlice';
import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

export default function ToDoListView() {
  const listData = useAppSelector(data => data.user.toDoList);
  const listPageCount = useAppSelector(data => data.user.listPageCount);
  const dispatch = useAppDispatch();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPagination, setIsPagination] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchNextData = () => {
    if (isFetchingRef.current || listData.length === 0) {
      return;
    }
    isFetchingRef.current = true;
    setIsPagination(true);
    dispatch(userActions.toDoList({page: listPageCount + 1}))
      .unwrap()
      .then(() => {
        isFetchingRef.current = false;
      })
      .catch(error => {
        console.error('Pagination API error:', error);
      })
      .finally(() => {
        setIsPagination(false);
      });
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    dispatch(userActions.toDoList())
      .unwrap()
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [dispatch]);
  const renderItem = useCallback(({item}: {item: ITodoListItem}) => {
    return <TodoListItem item={item} />;
  }, []);
  const listFooterComponent = () => {
    if (isPagination) {
      return <ActivityIndicator color={colors.primary} />;
    }
  };
  return (
    <FlatList
      data={listData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.columnWrapper}
      numColumns={2}
      onEndReached={() => {
        if (!isFetchingRef.current) {
          fetchNextData();
        }
      }}
      ListFooterComponent={listFooterComponent}
      removeClippedSubviews
      initialNumToRender={20}
      maxToRenderPerBatch={20}
      windowSize={5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  columnWrapper: {
    gap: 12,
    justifyContent: 'space-between',
  },
});
