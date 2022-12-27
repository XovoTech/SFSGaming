import { ToastTypes } from "../../constants/enums";
import { IToast } from "../../model/app";
import { SHOW_TOAST, SET_NOTIFICATION_TOAST } from "../constant/app";

export const setToast = (toastInfo: IToast) => {
  return {
    type: SHOW_TOAST,
    toast: {
      title: toastInfo.title,
      text: toastInfo.text,
      type: toastInfo.type || ToastTypes.error,
      icon: toastInfo.icon,
      iconType: toastInfo.iconType,
    },
  };
};

export const setNotificationToast = (notification = {}) => {
  return {
    type: SET_NOTIFICATION_TOAST,
    notification,
  }
}

