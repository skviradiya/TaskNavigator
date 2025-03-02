import {addToQueue, getQueue} from '@App/axios/offlineQueue';
import {NETWORK_ERROR} from '@App/constants/ErrorMessage';
import {OfflineOperationType} from '@App/types/network';
import {
  ICreateTaskRequest,
  ICreateTaskResponse,
  IDeleteTaskRequest,
  ITodoListItem,
  ITodoListRequest,
  ITodoListResponse,
  IUpdateTaskRequest,
  IUpdateTaskResponse,
  IVerifyTokenRequest,
  IVerifyTokenResponse,
} from '@App/types/slice/userSlice';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios, {InternalAxiosRequestConfig} from 'axios';

export const verifyToken = createAsyncThunk(
  'users',
  async (params: IVerifyTokenRequest, {rejectWithValue}) => {
    try {
      const response = await axios.get<IVerifyTokenResponse>(
        '/users',
        params?.token
          ? {
              headers: {
                Authorization: 'Bearer ' + params.token,
              },
            }
          : {},
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || 'An error occurred');
    }
  },
);
export const toDoList = createAsyncThunk(
  'todos',
  async (params: ITodoListRequest, {rejectWithValue}) => {
    try {
      const response = await axios.get<ITodoListResponse>('/todos', {
        params: {
          page: params?.page || 1,
          per_page: 20,
        },
      });
      const queueData = (await getQueue()) as InternalAxiosRequestConfig[];

      const queueMapped = queueData.map(req => {
        const id =
          req.method === 'post'
            ? JSON.parse(req.data).due_on
            : req.url?.split('/').pop();

        return {
          method: req.method,
          id,
          data: req.data ? JSON.parse(req.data) : null,
          offlineOperation:
            req.method === 'post'
              ? OfflineOperationType.create
              : req.method === 'delete'
              ? OfflineOperationType.delete
              : OfflineOperationType.update,
        };
      });

      const responseData = response.data;
      const updatedResponse: ITodoListItem[] = [];

      responseData.forEach(item => {
        const queueItem = queueMapped.find(
          q => q.id?.toString() === item.id?.toString(),
        );
        if (queueItem) {
          updatedResponse.push({
            ...item,
            ...queueItem,
            offlineOperation: queueItem?.offlineOperation,
          });
        } else {
          updatedResponse.push(item);
        }
      });
      queueMapped.forEach(queueItem => {
        if (!updatedResponse.some(item => item.id === queueItem.id)) {
          updatedResponse.unshift({
            id: queueItem.id,
            due_on: queueItem.id,
            status: queueItem.data.status,
            title: queueItem.data.title,
            user_id: queueItem.data.user_id,
            offlineOperation: OfflineOperationType.create,
          });
        }
      });

      return updatedResponse.filter(
        item => item?.offlineOperation !== OfflineOperationType.delete,
      );
    } catch (error: any) {
      return rejectWithValue(error || 'An error occurred');
    }
  },
);

export const deleteTask = createAsyncThunk(
  'todos/delete',
  async (id: IDeleteTaskRequest, {rejectWithValue}) => {
    try {
      const response = await axios.delete('/todos/' + id);

      return response.data;
    } catch (error: any) {
      const originalRequest = error.config as InternalAxiosRequestConfig;
      if (error.message === NETWORK_ERROR) {
        await addToQueue(originalRequest);
      }
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);
export const createTask = createAsyncThunk(
  'todos/create',
  async (request: ICreateTaskRequest, {rejectWithValue}) => {
    try {
      const response = await axios.post<ICreateTaskResponse>('/todos', request);
      return response.data;
    } catch (error: any) {
      const originalRequest = error.config as InternalAxiosRequestConfig;
      if (error.message === NETWORK_ERROR) {
        await addToQueue(originalRequest);
      }
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);
export const updateTask = createAsyncThunk(
  'todos/update',
  async (request: IUpdateTaskRequest, {rejectWithValue}) => {
    try {
      const response = await axios.put<IUpdateTaskResponse>(
        `/todos/${request.id}`,
        {
          title: request.title,
          status: request.status,
          due_on: request.due_on,
          user_id: request.user_id,
        },
      );
      return response.data;
    } catch (error: any) {
      const originalRequest = error.config as InternalAxiosRequestConfig;
      if (error.message === NETWORK_ERROR) {
        await addToQueue(originalRequest);
      }
      return rejectWithValue(error.message || 'An error occurred');
    }
  },
);
export const getTaskDetailsByID = createAsyncThunk(
  'todos/getTaskDetailsByID',
  async (id: number | string, {rejectWithValue}) => {
    try {
      const response = await axios.get<IUpdateTaskResponse>(`/todos/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error || 'An error occurred');
    }
  },
);

const initialState = {
  isAuthenticated: false,
  userDetails: null,
  toDoList: <ITodoListItem[]>[],
  listPageCount: 1,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: state => {
      state.userDetails = initialState.userDetails;
      state.toDoList = initialState.toDoList;
      state.listPageCount = initialState.listPageCount;
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(toDoList.fulfilled, (state, action) => {
        if (!action.meta.arg?.page || action.meta.arg?.page === 1) {
          state.toDoList = action.payload;
          state.listPageCount = 1;
        } else if (
          (action.meta.arg?.page || 1) >= state.listPageCount &&
          action.payload.length !== 0
        ) {
          state.toDoList = [...state.toDoList, ...action.payload];
          state.listPageCount = action.meta.arg?.page || 1;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.toDoList = state.toDoList.filter(
          task => task.id !== action.meta.arg,
        );
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.toDoList = [action.payload, ...state.toDoList];
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.toDoList = [
          updatedTask,
          ...state.toDoList.filter(task => task.id !== updatedTask.id),
        ];
      })
      .addCase(deleteTask.rejected, (state, action) => {
        if (action.payload === NETWORK_ERROR) {
          state.toDoList = state.toDoList.filter(
            task => task.id !== action.meta.arg,
          );
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        if (action.payload === NETWORK_ERROR) {
          console.log('🚀 ~ .addCase ~ action.payload:', action.meta.arg);
          const taskIndex = state.toDoList.findIndex(
            item => item.id === action.meta.arg.due_on,
          );
          console.log('🚀 ~ .addCase ~ taskIndex:', taskIndex);

          const createdTask = {
            ...action.meta.arg,
            offlineOperation: OfflineOperationType.create,
            id: action.meta.arg.due_on || new Date().toISOString(),
          };
          if (taskIndex >= 0) {
            state.toDoList[taskIndex] = createdTask;
          } else {
            state.toDoList = [createdTask, ...state.toDoList];
          }
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        if (action.payload === NETWORK_ERROR) {
          const taskIndex = state.toDoList.findIndex(
            item => item.id === action.meta.arg.id,
          );
          const updatedTask = state.toDoList[taskIndex];
          state.toDoList[taskIndex] = {
            ...updatedTask,
            ...action.meta.arg,
            offlineOperation: OfflineOperationType.update,
          };
        }
      });
  },
});

export default userSlice.reducer;
export const userActions = {
  ...userSlice.actions,
  toDoList,
  deleteTask,
  createTask,
  verifyToken,
  updateTask,
  getTaskDetailsByID,
};
