import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import React, { useMemo } from 'react';
import { closeDrawer, drawerRef } from '../helper/drawer';
import { useDispatch, useSelector } from 'react-redux';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import DrawerProfile from './DrawerProfile';
import { moderateScale } from 'react-native-size-matters';
import { navigate } from '../helper/navigator';
import DeviceInfo from 'react-native-device-info';
import { IconTypes } from '../constants/enums';
import Icon from './Icon';
import { AppThunkDispatch, RootState } from '../store/types';
import { IDrawerItem } from '../model/app';
import auth from '@react-native-firebase/auth';
import { authenticate } from '../store/actions/auth';

const socialIconLinks = [
  {
    icon: "discord",
    link: "https://discord.gg/K69BhKp",
    color: "#7289da",
  },
  {
    icon: "instagram",
    link: "https://instagram.com/sfs_gaming_?igs",
    color: "#fccc63",
  },
  {
    icon: "twitter",
    link: "https://twitter.com/SFS_GAMINGG?s=09",
    color: "#00acee",
  },
  {
    icon: "youtube",
    link: "https://www.youtube.com/@SFSGAMING",
    color: "#C4302B",
  },
]

const drawerNavs: Array<IDrawerItem> = [];

const CustomDrawerContent = React.memo(() => {
  const styles = useStyles();
  const dispatch = useDispatch<AppThunkDispatch>();

  const onItemPress = (routeName: string) => {
    closeDrawer();
    navigate(routeName);
  };

  const onLogout = () => {
    Alert.alert(
      'Log out',
      'Are you sure you wish to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes, log me out',
          onPress: async () => {
            await auth().signOut();
            closeDrawer();
            dispatch(authenticate(null));
          },
        },
      ],
      { cancelable: false },
    );
  };

  const openXovoTech = () => Linking.openURL('https://xovotech.com/');

  return (
    <View style={styles.menu}>
      <DrawerProfile style={styles.profileContainer} />
      <ScrollView scrollsToTop={false} >
        {drawerNavs.map((item) => {
          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={item.key}
              onPress={() => onItemPress(item.key)}
              style={styles.menuTouchArea}>
              <Icon style={styles.menuIcon} type={item.iconType} name={item.icons?.[1]} />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.socialIconContainer}>
        {socialIconLinks.map(social => {
          const onPress = () => {
            Linking.openURL(social.link)
          }
          return (
            <TouchableOpacity
              activeOpacity={0.6}
              key={social.icon}
              onPress={onPress}
              style={styles.menuTouchArea}>
                <Icon name={social.icon} style={[styles.socialIcon, {color: social.color}]}/>
              </TouchableOpacity>
          )
        })}
      </View>
      <Text style={styles.collaborationText}>In Collaboration with</Text>
      <Text style={[styles.collaborationText, styles.xovoText]} onPress={openXovoTech}>XovoTech</Text>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onLogout}
          style={styles.logOutButtonContainer}>
          <Icon style={styles.menuIcon} type={IconTypes.Feather} name="log-out" />
          <Text style={[styles.menuText, styles.menuText2]}>Sign out</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>v. {DeviceInfo.getVersion()}</Text>
      </View>
    </View>
  );
});

const AppDrawer = React.memo<React.PropsWithChildren<{}>>((props) => {
  const user = useSelector((store: RootState) => store.auth.user);

  return (
    <DrawerLayout
      ref={drawerRef}
      keyboardDismissMode="on-drag"
      drawerWidth={moderateScale(250)}
      drawerPosition={'left'}
      drawerType="front"
      drawerLockMode={user?.uid ? 'unlocked' : 'locked-closed'}
      renderNavigationView={() => <CustomDrawerContent />}>
      {props.children}
    </DrawerLayout>
  );
});

const useStyles = () => {
  const theme = useSelector((store: RootState) => store.theme);

  return useMemo(() => StyleSheet.create({
    menu: {
      flex: 1,
      backgroundColor: theme.background.color,
      paddingLeft: theme.spacingFactor,
      paddingRight: theme.spacingFactor / 2,
      borderTopRightRadius: theme.spacingFactor * 4,
      borderBottomRightRadius: theme.spacingFactor * 4,
    },
    menuTouchArea: {
      flexDirection: 'row',
      alignItems: "center",
      padding: theme.spacingFactor / 2,
      marginVertical: theme.spacingFactor / 4,
    },
    logOutButtonContainer: {
      flexDirection: 'row',
      alignItems: "center",
      padding: theme.spacingFactor / 2,
      paddingHorizontal: theme.spacingFactor * 1.8,
      marginVertical: theme.spacingFactor / 4,
      borderRadius: theme.spacingFactor,
      backgroundColor: theme.color.grayBackground2,
    },
    collaborationText: {
      color: theme.color.spider,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.caption,
      textAlign: 'center',
    },
    xovoText: {
      fontSize : theme.fontSize.h5,
      color: theme.color.primary,
    },
    menuIcon: {
      color: theme.color.gray1,
      fontSize: theme.fontSize.h3,
      margin: theme.spacingFactor,
      marginLeft: 0,
    },
    menuTouchActive: {
      backgroundColor: theme.color.primary,
    },
    menuText: {
      fontFamily: theme.fontFamily.regular,
      color: theme.color.gray1,
      fontSize: theme.fontSize.h3,
    },
    socialIconContainer: {
      flexDirection: 'row',
      justifyContent:'space-around',
      alignItems:'center',
      marginBottom: theme.spacingFactor,
      paddingBottom: theme.spacingFactor,
      bottomBottomWidth: 1,
      borderColor: theme.color.white,
    },
    socialIcon: {
      fontSize: theme.fontSize.h2,
    },
    profileContainer: {
      height: moderateScale(100),
      borderBottomWidth: moderateScale(1),
      margin: theme.spacingFactor,
      borderColor: theme.color.border,
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    versionText: {
      textAlign: "right",
      margin: moderateScale(10),
      fontFamily: theme.fontFamily.regular,
      color: theme.color.gray1,
      fontSize: theme.fontSize.h6,
    },
    menuText2: {
      fontSize: theme.fontSize.h5,
    },
  }), [theme])
}

export default AppDrawer;
