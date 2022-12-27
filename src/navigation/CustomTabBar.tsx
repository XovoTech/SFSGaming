import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import Icon from '../components/Icon';
import { IconTypes } from '../constants/enums';

const AnimatedTabBar = React.memo<MaterialTopTabBarProps>((props) => {
  const { state, descriptors, navigation } = props;
  const theme = useSelector((store: RootState) => store.theme);

  const styles = useStyles();

  return (

      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          const options = descriptor.options as typeof descriptor.options & { iconType: IconTypes, tabBarIcon: (b: boolean) => string };
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;
          const color = theme.color.primary
          const activeStyle = isFocused ? { borderBottomColor: theme.color.primary, borderBottomWidth: theme.spacingFactor / 5 } : {};

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented)
              navigation.navigate(route.name);

          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              activeOpacity={0.6}
              key={route.key}
              style={[styles.tabItemWrapper, activeStyle]}
            >
              <Icon type={options.iconType} name={options.tabBarIcon(isFocused)} style={[styles.iconStyle, { color }]} />
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              <Text style={[styles.labelStyle, { color, borderBottomColor: isFocused ? color : "transparent" }]}>
                {typeof label == "string" ? label : ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
  );
});

const useStyles = () => {
  const theme = useSelector((store: RootState) => store.theme);
  return useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: theme.background.color,
      borderTopColor: theme.color.gray1,
      position: "relative",
      bottom: 0,
    },
    tabItemWrapper: {
      flex: 1,
    },
    overlayStyle: {
      backgroundColor: theme.color.spider,
      flex: 1,
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    iconStyle: {
      margin: theme.spacingFactor / 2,
      marginTop: theme.spacingFactor,
      textAlign: 'center',
      fontSize: theme.fontSize.h2,
    },
    labelStyle: {
      textAlign: "center",
      borderBottomWidth: theme.spacingFactor / 2,
      fontSize: theme.fontSize.caption,
      paddingBottom: theme.spacingFactor,
    },
    collapsableView: {
      backgroundColor: theme.background.color,
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: 0,
      zIndex: 1,
    },
    closeCollapseIconWrapper: {
      position: 'absolute',
      zIndex: 1,
      justifyContent: "center",
      alignItems: 'center',
    },
    reorderBtn: {
      color: theme.color.gray1,
      borderColor: theme.color.border,
      padding: theme.spacingFactor,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.body,
    },
    buttonWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    closeCollapseIcon: {
      color: theme.color.icon1,
      fontSize: theme.fontSize.h1,
    },
    collapsableContent: {
      flex: 0.95,
      margin: theme.spacingFactor,
      paddingTop: theme.spacingFactor * 1.5,
    },
    moreNavItemWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: "space-between",
      paddingVertical: theme.spacingFactor,
      marginVertical: theme.spacingFactor / 3,
    },
    moreNavItemIcon: {
      fontSize: theme.fontSize.h3,
      color: theme.color.gray1,
      marginHorizontal: theme.spacingFactor * 1.5,
    },
    moreNavItemText: {
      fontSize: theme.fontSize.body,
      color: theme.color.gray1,

    },
    moreNavItemIconTextWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  }), [theme])
}

export default AnimatedTabBar
