import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from '../../model/user';

export const REGISTER = 'REGISTER';
export const LOGIN = 'LOGIN';
export const UPDATE_LIKED_POSTS = 'UPDATE_LIKED_POSTS';
export const SETLOADING = 'SETLOADING';
export const AUTHENTICATE = 'AUTHENTICATE';
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
export const LOGOUT = 'LOGOUT';

export const removeAuthUser = () => {
  AsyncStorage.removeItem('userData');
  return {
    type: LOGOUT,
  };
};

export const authenticate = (user: IUser | null, access_token = "") => {
  return {
    type: LOGIN,
    user,
    access_token,
  };
};

export const updateUserProfile = (user: IUser) => {
  return {
    type: UPDATE_USER_INFO,
    user,
  };
};
