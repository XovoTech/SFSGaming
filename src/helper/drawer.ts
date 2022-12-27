import React from 'react';
import { DrawerLayout } from 'react-native-gesture-handler';

export const drawerRef = React.createRef<DrawerLayout>();

export const openDrawer = () => {
  if (drawerRef.current)
    drawerRef.current.openDrawer();
};

export const closeDrawer = () => {
  if (drawerRef.current)
    drawerRef.current.closeDrawer();
};
