import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View, Easing, TouchableOpacity, StyleProp } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { getDeviceWidth } from '../helper/size';
import { useDispatch, useSelector } from 'react-redux';
import { setToast } from '../store/actions/app';
import { IconTypes, ToastTypes } from '../constants/enums';
import Icon from './Icon';
import { RootState } from '../store/types';
import { IToast } from '../model/app';

const IconSets: { [key in ToastTypes]: string } = {
    [ToastTypes.error]: "report",
    [ToastTypes.success]: "check",
    [ToastTypes.warn]: "warning",
    [ToastTypes.primary]: "string",
    [ToastTypes.secondary]: "string",
    [ToastTypes.dark]: "string",
};

const INITIAL_POSITION = -moderateScale(120);
const MAX_POSITION = 0;

type propTypes = {
    style?: StyleProp<any>
}

const Toast = React.memo<propTypes>((props) => {
    const toast = useSelector((store: RootState) => store.app.toast);
    // const text = "Text";
    // const title = "Title";
    // const type = ToastTypes.success;

    const styles = useStyles({ type: toast?.type || ToastTypes.error });
    const dispatch = useDispatch();
    const topValue = useRef(new Animated.Value(INITIAL_POSITION)).current;
    const timeoutId = useRef(0);

    const onDismiss = useCallback(() => {
        clearTimeout(timeoutId.current)
        Animated.timing(topValue, {
            toValue: INITIAL_POSITION,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start(() => {
            dispatch(setToast({ title: "", text: "", type: toast?.type }));
        })
    }, [dispatch, topValue, toast])

    useEffect(() => {
        let value = INITIAL_POSITION
        if (toast?.text) {
            value = MAX_POSITION;
            clearTimeout(timeoutId.current)
            timeoutId.current = setTimeout(onDismiss, 6000)
        }

        Animated.timing(topValue, {
            toValue: value,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
        }).start()

    }, [toast, topValue, onDismiss])

    return (
        <Animated.View style={[styles.container, props.style, { transform: [{ translateY: topValue }] }]}>
            <Icon type={toast?.iconType || IconTypes.MaterialIcons} name={toast?.icon || IconSets[toast?.type || ToastTypes.error] || IconSets['error']} style={styles.typeIcon} />
            <View style={styles.textWrapper}>
                <Text numberOfLines={1} style={[styles.text, styles.title]}>{toast?.title}</Text>
                <Text numberOfLines={2} style={styles.text}>{toast?.text}</Text>
            </View>
            <TouchableOpacity style={styles.buttonWrapper} onPress={onDismiss}>
                <Icon type={IconTypes.MaterialIcons} name="close" style={styles.closeIcon} />
            </TouchableOpacity>
        </Animated.View>
    );
});

const useStyles = ({ type }: { type: IToast['type'] }) => {
    const theme = useSelector((store: RootState) => store.theme)
    return useMemo(() => StyleSheet.create({
        container: {
            // height: moderateScale(120),
            width: getDeviceWidth(),
            position: "absolute",
            backgroundColor: theme.color?.[type || ToastTypes.error] || theme.color.error,
            flexDirection: "row",
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 99,
            paddingHorizontal: theme.spacingFactor * 2,
            paddingVertical: theme.spacingFactor * 3,
            borderBottomRightRadius: theme.spacingFactor * 4,
            borderBottomLeftRadius: theme.spacingFactor * 4,
        },
        title: {
            color: theme.color.white,
            fontSize: theme.fontSize.h3,
            fontFamily: theme.fontFamily.bold,
        },
        text: {
            color: theme.color.white,
            fontSize: theme.fontSize.body,
            fontFamily: theme.fontFamily.regular,
        },
        typeIcon: {
            fontSize: theme.fontSize.h1 + (theme.spacingFactor / 2),
            color: theme.color.white,
        },
        closeIcon: {
            fontSize: theme.fontSize.h4,
            color: theme.color.white,
        },
        textWrapper: {
            width: "70%",
        },
        buttonWrapper: {
            padding: moderateScale(2),
            marginRight: moderateScale(4),
        },
    }),
        [theme, type])
}

export default Toast;
