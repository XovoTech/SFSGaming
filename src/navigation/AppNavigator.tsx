import AnimatedTabBar from './CustomTabBar';
import React, { useMemo } from 'react';
import { navigationRef } from '../helper/navigator';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RootState } from '../store/types';
import { INavItem } from '../model/app';
// Screens
import Login from '../screens/Login';
import SharingScreen from '../screens/Sharing';
import Signup from '../screens/Signup';
import Edit from '../screens/Edit';
import Upload from '../screens/Upload';
import GamingList from '../screens/GamingList';
import EditList from '../screens/EditList';
import { StyleSheet } from 'react-native';

type KeyRoute = {
  [key in string]: React.NamedExoticComponent | ((props: any) => JSX.Element)
}

const routes: KeyRoute = {
  "Sharing": SharingScreen,
  "Edit": Edit,
  "Upload": Upload,
  "Gaming": GamingList,
  "EditList": EditList,
}

const MainStack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();
const RootStack = createNativeStackNavigator();

const tabNavs: Array<INavItem> = [
  {
    id: 1,
    key: "Sharing",
    label: "Sharing",
    icons: ["magnify", "magnify"],
  },
  {
    id: 2,
    key: "EditList",
    label: "Edit List",
    icons: ["pencil", "pencil-outline"],
  },
  {
    id: 3,
    key: "Upload",
    label: "Upload",
    icons: ["upload", "upload-outline"],
  },
  {
    id: 4,
    key: "Gaming",
    label: "SFS Gaming",
    icons: ["youtube", "youtube"],
  },
]


const MainTabs = React.memo(() => {
  const theme = useSelector((store: RootState) =>store.theme);
  const styles = useStyles();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.color.primary,
        tabBarStyle: {
          elevation: 20,
          shadowColor: theme.color.spider,
          shadowOffset: { height: 2, width: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          position: 'relative',
        },
      }}
      initialRouteName="Sharing"
      tabBarPosition="bottom"
      sceneContainerStyle={styles.sceneContainerStyle}
      tabBar={tabProps => <AnimatedTabBar {...tabProps} />}
    >
      {tabNavs.map(tab => (
        <Tab.Screen
          key={tab.key}
          name={tab.label}
          navigationKey={tab.key}
          component={routes[tab.key]}
          options={{
            tabBarIcon: focused => focused ? tab.icons[0] : tab.icons[1],
          }}
        />
      ))}
    </Tab.Navigator>
  )
});

routes["Index"] = MainTabs;

const AppNavigator = React.memo(() => {

  const filteredRoutes = useMemo(() => {
    const t = Object.assign({}, routes);
    for (let tab of tabNavs) {
      delete t[tab.key];
    }
    return Object.keys(t);
  }, []);

  return (
    <MainStack.Navigator
      initialRouteName="Index"
      screenOptions={{
        headerShown: false,
        presentation: "card",
        gestureDirection: "horizontal",
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      {filteredRoutes.map(key => (
        <MainStack.Screen
          key={key}
          name={key}
          component={routes[key]}
        />
      ))}
    </MainStack.Navigator>
  );
});

export default () => {
  const user = useSelector((store: RootState) => store.auth.user);

  const authRoutes: KeyRoute = useMemo(() => {
    return {
      "Login": Login,
      "Signup": Signup,
    }
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
    >
      <RootStack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          presentation: "card",
          gestureDirection: "horizontal",
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {user?.uid ? (
          <RootStack.Screen
            name="Main"
            component={AppNavigator}
            options={{ headerShown: false }}
          />
        ) : Object.keys(authRoutes).map((key) => (
          <MainStack.Screen
            key={key}
            name={key}
            component={authRoutes[key]}
          />
        ))}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const useStyles = () => {
  const theme = useSelector((store: RootState) => store.theme);
  return useMemo(() => StyleSheet.create({
    sceneContainerStyle: {
      backgroundColor: theme.color.grayBackground3,
      opacity: 1,
    },
  }), [theme])
}
