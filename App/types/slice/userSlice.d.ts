import {OfflineOperationType} from '../network';

export type IVerifyTokenRequest =
  | {
      token: string;
    }
  | undefined;
export type IVerifyTokenResponse = {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}[];

export type ITodoListRequest =
  | {
      page?: number;
    }
  | undefined;

export type ITodoListResponse = ITodoListItem[];

export interface ITodoListItem {
  id: number | string;
  user_id: number;
  title: string;
  due_on: string;
  status: string;
  offlineOperation?: OfflineOperationType;
}

export type IDeleteTaskRequest = number | string;

export type ICreateTaskRequest = {
  title: string;
  status: string;
  due_on: string;
  user_id: number;
};
export type ICreateTaskResponse = {
  id: number;
  user_id: number;
  title: string;
  due_on: string;
  status: string;
};
export type IUpdateTaskRequest = {
  id: number | string;
  title: string;
  status: string;
  due_on: string;
  user_id: number;
};
export type IUpdateTaskResponse = {
  id: number;
  title: string;
  status: string;
  due_on: string;
  user_id: number;
};
