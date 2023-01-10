import React, { useMemo, useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, TouchableOpacity, Keyboard, Platform, StyleProp } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { getDeviceHeight, getDeviceWidth } from '../helper/size';
import { openDrawer } from '../helper/drawer';
import { goBack, navigate } from '../helper/navigator';
import Icon from './Icon';
import { useSelector } from 'react-redux';
import UserProfileAvatar from './profile/UserProfileAvatar';
import { IUser } from '../model/user';
import { RootState } from '../store/types';
import { IconTypes } from '../constants/enums';
import { IInputRef } from './Input';

type propTypes = {
  user?: IUser,
  showBack?: boolean,
  showDrawer?: boolean,
  showProfile?: boolean,
  title?: string,
  renderCustomCenter?: React.ReactNode,
  style?: StyleProp<any>,
  renderCustomRight?: React.ReactNode | ((props: { style: StyleProp<any>}) => React.ReactNode),
  userProfileStyle?: StyleProp<any>,
  titleStyle?: StyleProp<any>,
}

const headerTransform = new Animated.Value(0);

const Header = React.memo<propTypes>((props) => {
  const { showBack = true, showProfile = false, showDrawer = true } = props;

  const styles = useStyles(props);
  const inputRef = useRef<IInputRef>();

  const onProfileClick = () => {
    if (props.user)
      navigate("Profile", { userId: props.user?.uid })
    else
      openDrawer()
  }

  useEffect(() => {
    const keyboardSub = Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

    // cleanup functionS
    return () => {
      keyboardSub.remove();
    }
  }, []);

  const _keyboardDidHide = () => {
    if (inputRef.current) inputRef.current.blur()
  };

  return (
    <Animated.View style={[styles.container, props.style, { transform: [{ translateY: headerTransform }] }]}>

      {/* Back Button and user profile */}
      <View style={styles.userProfileContainer}>
        {showBack && !showDrawer ? (
          <TouchableOpacity activeOpacity={0.6} onPress={goBack}>
            <Icon name="arrow-left" style={styles.iconStyle} />
          </TouchableOpacity>
        ) : null}

        {showDrawer ? (
          <TouchableOpacity activeOpacity={0.6} onPress={openDrawer}>
            <Icon type={IconTypes.FontAwesome} name="bars" style={[styles.iconStyle, styles.primaryIconStyle]} />
          </TouchableOpacity>
        ) : null}

        {showProfile ? (
          <UserProfileAvatar style={props.userProfileStyle} onPress={onProfileClick} user={props.user} />
        ) : null}
      </View>

      <View style={styles.titleWrapper}>
        {props.title && !props.renderCustomCenter ? (
          <Animated.Text numberOfLines={1} style={[styles.headerTitle, props.titleStyle]}>
            {props.title}
          </Animated.Text>
        ) : null}
        {props.renderCustomCenter ? props.renderCustomCenter : null}
      </View>

      {props.renderCustomRight ? (
        <View style={styles.leftView}>
          {typeof props.renderCustomRight == "function" ? props.renderCustomRight({ style: styles.iconStyle }) : props.renderCustomRight}
        </View>
      ) : null}
    </Animated.View>
  );
});

const useStyles = (props: propTypes) => {
  const theme = useSelector((store: RootState) => store.theme);
  return useMemo(() => StyleSheet.create({
    container: {
      height:  Platform.OS == 'ios' ? getDeviceHeight() *  0.07 : getDeviceHeight() * 0.1,
      width: getDeviceWidth(),
      backgroundColor: theme.background.color,
      flexDirection: "row",
      zIndex: 1,
      paddingHorizontal: theme.spacingFactor,
      borderBottomWidth: moderateScale(1),
      borderBottomColor: theme.color.border,
      justifyContent: 'space-between',
      overflow: "hidden",
    },
    userProfileContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerTitle: {
      color: props.style?.color || theme.color.spider,
      textAlign: props.style?.textAlign || "left",
      fontFamily: props.style?.fontFamily || theme.fontFamily.bold,
      fontSize: props.style?.fontSize || theme.fontSize.h2,
      marginHorizontal: theme.spacingFactor,
      flex: 1,
    },
    titleWrapper: {
      flexDirection: "row",
      flex: 1,
      // justifyContent: 'flex-end',
      position: 'relative',
      alignItems:'center',
    },
    leftView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryIconStyle: {
      color: props.style?.color || theme.color.primary,
    },
    iconStyle: {
      fontSize: theme.fontSize.h2,
      color: props.style?.color || theme.color.spider,
      paddingHorizontal: theme.spacingFactor / 2,
    },
  }), [theme, props])

};

export default Header;
