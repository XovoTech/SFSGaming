import app, { IAppReducer } from './app'
import auth, { IAuthReducer } from './auth'
import { combineReducers } from 'redux'
import theme, { IThemeReducer } from './theme';

type Reducer = {
  app: IAppReducer,
  auth: IAuthReducer,
  theme: IThemeReducer,
}

export default combineReducers<Reducer>({
  app,
  auth,
  theme,
});
