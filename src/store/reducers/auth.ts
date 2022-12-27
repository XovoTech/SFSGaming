import { IUser } from '../../model/user';
import { LOGIN, LOGOUT, UPDATE_USER_INFO } from '../actions/auth';

export interface IAuthReducer {
  user: IUser | null,
  access_token?: string | null,
}

const initialState = {
  access_token: null,
  user: null,
};

export default (state: IAuthReducer = initialState, action: any) => {
  switch (action.type) {
    case LOGIN:
    return {
      ...state,
      access_token: action.access_token,
      user: action.user,
    }

    case LOGOUT:
      return {
        ...state,
        user: initialState.user,
      };

    case UPDATE_USER_INFO:
      return {
        ...state,
        user: action.user,
      };

    default:
      return state;
  }
};
