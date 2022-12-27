import { Animated, ScrollView, StyleSheet, TouchableOpacity, ViewStyle, StyleProp, TextStyle, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import React, { useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import ReAnimated from 'react-native-reanimated';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import { getDeviceWidth } from '../helper/size';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import { NavigationState } from '@react-navigation/native';
import { ArrayElement } from '../model/app';
import Icon from './Icon';
import { IconTypes } from '../constants/enums';

type propTypes = {
  data: { [key in string | number]: React.ReactNode },
  formatTabLabel?: (e: ArrayElement<NavigationState<any>['routes']>) => string,
  showTabBar?: boolean,
  onTabChange?: (index: string | number, previousIndex?: string | number | null) => void,
  style?: StyleProp<ViewStyle>,
  tabItemTextStyle?: StyleProp<TextStyle>,
  tabItemStyle?: StyleProp<ViewStyle>,
  tabLabelWrapperStyle?: StyleProp<any>,
  iconKey?: boolean,
}

export interface ITabRef {
  setTabIndex: (newIndex: number, previousIndex?: number) => void;
}

const Tab = React.forwardRef<ITabRef, propTypes>((props, ref) => {
  const theme = useSelector((store: RootState) => store.theme);
  const [index, setIndex] = useState<number>(0);
  const styles = useStyles();
  const scrollViewRef = useRef<ScrollView>(null);
  const positions: { [key in number]: any } = useRef({}).current;
  const scrollPosition = useRef<number>(0);

  const renderScene = useCallback(({ route }: SceneRendererProps & { route: any }) => props.data[route.key], [props.data]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent, i: number) => (positions[i] = nativeEvent.layout), [positions]);
  const onScroll = useCallback(({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => { scrollPosition.current = nativeEvent.contentOffset.x }, []);

  const routes = useMemo(
    () =>
      Object.keys(props.data).map((screenId) => {
        return {
          key: screenId,
          title: screenId.trim(),
        };
      }),
    [props.data],
  );

  const onIndexChange = useCallback((newIndex: number, previousIndex?: number) => {
    const keys = Object.keys(props.data);

    if (!keys[newIndex]) newIndex = keys.findIndex(k => k == `${newIndex}`); // extra in case of string key from ref calling

    const { x, width } = positions[newIndex];
    const scrollX = scrollPosition.current;

    if (x + width > getDeviceWidth())
      scrollViewRef.current?.scrollTo({ x, y: 0, animated: true });

    if (x < scrollX) scrollViewRef.current?.scrollTo({ x, y: 0, animated: true });

    if (props.onTabChange) props.onTabChange(keys[newIndex], previousIndex ? keys[previousIndex] : null);
    setIndex(newIndex);
  }, [positions, props]);

  const renderTabBar = useCallback((tabProps: SceneRendererProps & { navigationState: NavigationState<any>; }): React.ReactNode => {
    // Horizontal Navs
    return (
      <Animated.View style={props.tabLabelWrapperStyle}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.tabBar}
          horizontal={true}
          onScroll={onScroll}
          showsHorizontalScrollIndicator={false}>
          {tabProps.navigationState.routes.map((route, i) => {
            return (
              <TouchableOpacity
                style={[styles.tabItem, props.tabItemStyle, { borderBottomColor: index == i ? theme.color.primary : theme.color.border }]}
                key={route.key}
                activeOpacity={0.6}
                onLayout={(e) => onLayout(e, i)}
                onPress={() => onIndexChange(i, index)} >
                {
                  props.iconKey ? (
                    <Icon name={route.key} type={IconTypes.MaterialIcons} style={styles.iconTitle}/>
                  ) : (
                    <ReAnimated.Text
                      numberOfLines={1}
                      style={[
                        styles.tabLabelText,
                        props.tabItemTextStyle,
                        {
                          fontFamily: index == i ? theme.fontFamily.bold : theme.fontFamily.regular,
                          color: index == i ? theme.color.primary : theme.color.gray1,
                        },
                      ]}>
                      {props.formatTabLabel ? props.formatTabLabel(route) : route.key}
                    </ReAnimated.Text>
                  )
                }
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    );
  }, [props, index, styles, theme, onLayout, onIndexChange, onScroll]);

  useImperativeHandle(ref, () => {
    return {
      setTabIndex: onIndexChange,
    };
  }, [onIndexChange])

  if (!props.data)
    return null;

  return (
    <TabView
      style={props.style}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={onIndexChange}
      renderTabBar={props.showTabBar ? renderTabBar as any : () => null}
    />
  );
});

const useStyles = () => {
  const theme = useSelector((store: RootState) => store.theme);

  return useMemo(() => StyleSheet.create({
    tabBar: {
      // flexDirection: 'row',
      minWidth: getDeviceWidth(),
    },
    tabItem: {
      flex: 1,
      borderBottomWidth: theme.spacingFactor / 4,
    },
    tabLabelText: {
      flexDirection: 'row',
      // width: '100%',
      textAlign: 'center',
      fontSize: theme.fontSize.h5,
      marginVertical: theme.spacingFactor * 1.5,
      marginHorizontal: theme.spacingFactor * 2,
    },
    iconTitle: {
      fontSize: theme.fontSize.h2,
      margin: theme.spacingFactor,
      fontFamily: theme.fontFamily.bold,
      color: theme.color.primary,
      alignSelf: 'center',
    },
  }), [theme])
};

Tab.defaultProps = {
  formatTabLabel: (e) => e.name,
  showTabBar: true,
};

export default Tab;
