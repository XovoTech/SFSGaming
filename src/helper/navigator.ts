import React from 'react';
import { NavigationContainerRef, StackActions } from '@react-navigation/native';
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

export const navigate = (name: string, params?: any) => {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
};

export const replaceNavigate = (name: string, params?: any) => {
  if (navigationRef.current) {
    navigationRef.current.dispatch(StackActions.replace(name, params));
  }
};

export const goBack = () => {
  if (navigationRef.current) {
    navigationRef.current.goBack();
  }
};
