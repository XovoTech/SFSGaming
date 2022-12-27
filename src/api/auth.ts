import { setToast } from "../store/actions/app";
import { authenticate, removeAuthUser } from "../store/actions/auth";
import { ToastTypes } from "../constants/enums";
import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../store/types";
import { AxiosError, AxiosResponse } from "axios";

/********************************************************************************************************************/

export const login = (params: IApiParam = {}) => (dispatch: AppThunkDispatch) => {
  params.method = params.method || "POST";
  params.path = params.path || "auth/login"
  return dispatch(dispatchAPI(params, onSuccessLogin, onFailureLogin))
}

const onSuccessLogin = (response: AxiosResponse['data']) => (dispatch: AppThunkDispatch) => {
  console.log("onSuccessLogin", response);
  dispatch(authenticate(response.user, response.access_token));
}

const onFailureLogin = (error: AxiosError) => (dispatch: AppThunkDispatch) => {
  console.log("onFailureLogin", error.response);

  dispatch(setToast({
    title: 'Error',
    text: error.message || 'Something went wrong.?',
    type: ToastTypes.error,
  }))

}

/********************************************************************************************************************/

export const logout = (params: IApiParam = {}) => (dispatch: AppThunkDispatch) => {
  params.method = params.method || "POST";
  params.path = params.path || "auth/logout"
  return dispatch(dispatchAPI(params, onSuccessLogout))
}

const onSuccessLogout = (response: AxiosResponse['data']) => (dispatch: AppThunkDispatch) => {
  console.log("onSuccessLogout", response)
  dispatch(removeAuthUser())
  // CookieManager.clearAll();
  // AsyncStorage.removeItem("dms_universe_session");
  // AsyncStorage.removeItem("X-Device-UDID");
}
