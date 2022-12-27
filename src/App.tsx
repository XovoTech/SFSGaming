import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, Platform, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';
import Toast from './components/Toast';
import { authenticate } from './store/actions/auth';
// import { useSocket } from './config/socket';
import { AppThunkDispatch, RootState } from './store/types';
import { AUTH_USER_KEY } from './constants/value';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppDrawer from './components/Drawer';
import RootStackScreen from './navigation/AppNavigator';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export default () => {
  const dispatch = useDispatch<AppThunkDispatch>();
  const [loader, setLoader] = useState<boolean>(true);
  const styles = useStyles();
  // useSocket();
  const { user, theme } = useSelector((store: RootState) => {
    return {
      user: store.auth.user,
      theme: store.theme,
    }
  });

  const tryLogin = async () => {
    try {
      let userData: FirebaseAuthTypes.User | null = auth().currentUser;

      if (!userData) {
        userData = JSON.parse(await AsyncStorage.getItem(AUTH_USER_KEY) || "{}")
      }

      if (!userData || !Object.keys(userData).length) return setLoader(false);

      await dispatch(authenticate(userData));
    } catch (e) {
      console.log(e)
    }
  };

  useEffect(() => {
    (async () => { // IIFE to support async
      if (!user?.uid) {
        try {
          await tryLogin();
        } catch (e) {
          console.log(e);
        }
      } else {
        setLoader(false);
      }
      SplashScreen.hide()
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  return (
    <SafeAreaView style={styles.safeAreaContainer} >
      <GestureHandlerRootView style={styles.gestureContainer}>
        <AppDrawer>
          <RootStackScreen />
          <Toast />
        </AppDrawer>
        <StatusBar barStyle={theme.type == 'Light' ? "dark-content" : 'light-content'} backgroundColor={theme.background.color} />
        {
          loader ? (
            <View style={styles.screen} >
              <ActivityIndicator size="large" color={theme.color.primary} />
            </View>
          ) : null
        }
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const useStyles = () => {
  const theme = useSelector((store: RootState) => store.theme);
  return useMemo(() => StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      paddingTop: Platform.OS == 'ios' ? theme.spacingFactor * 4 : 0,
      paddingBottom: Platform.OS == 'ios' ? theme.spacingFactor * 2.5 : 0,
      backgroundColor: theme.background.color,
      position: 'relative',
    },
    gestureContainer: {
      flex: 1,
      marginTop: Platform.OS == 'ios' ? theme.spacingFactor * 2 : 0,
      // marginBottom: Platform.OS == 'ios' ? theme.spacingFactor * 2 : 0,
    },
    screen: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: 1,
      backgroundColor: theme.background.color,
    },
  }), [theme])
}
