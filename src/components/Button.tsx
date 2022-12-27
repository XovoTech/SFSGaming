import React, { useCallback, useImperativeHandle, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextProps,
    StyleProp,
    TouchableOpacity,
} from 'react-native';
import Icon from './Icon';
import { moderateScale } from 'react-native-size-matters';
import { IconTypes } from '../constants/enums';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

type propTypes = {
    disabled?: boolean,
    onPress: (event?: GestureResponderEvent, ref?: React.ForwardedRef<IButtonRef>) => void,
    iconType?: IconTypes,
    testID?: string,
    iconName?: string,
    iconStyle?:StyleProp<any>,
    style?: StyleProp<any>,
    numberOfLines?: TextProps['numberOfLines'],
    ellipsizeMode?: TextProps['ellipsizeMode'],
    outline?: boolean,
    btnText?: TextProps['style'],
}

export interface IButtonRef {
    showLoader: (loader?: boolean) => void;
    press: (event?: GestureResponderEvent) => void;
    getProps: () => propTypes,
    isLoading: () => boolean,
    isDisabled: () => boolean,
}

const Button = React.forwardRef<IButtonRef, React.PropsWithChildren<propTypes>>((props, ref) => {
    const [loader, setLoaderState] = useState(false);
    const theme = useSelector((store: RootState) => store.theme);
    const styles = useStyles(props);

    const onPress = useCallback((e?: GestureResponderEvent) => {
        if (!props.disabled || !loader) props.onPress(e, ref);
    }, [props, loader, ref]);

    useImperativeHandle(ref, () => ({
        showLoader: (loaderState = true) => {
            setLoaderState(loaderState)
        },
        press: onPress,
        getProps: () => props,
        isLoading: () => loader,
        isDisabled: () => props.disabled || loader,
    }), [loader, onPress, props])

    return (
        <TouchableOpacity
            testID={props?.testID}
            disabled={props.disabled || loader}
            onPress={onPress} activeOpacity={0.6}
            style={[styles.container, props.disabled || loader ? styles.loadingStyle : null, props.style]}>
            {props.iconName && !loader ? <Icon name={props.iconName} type={props.iconType} style={[styles.iconStyle, props.iconStyle]} /> : null}
            {loader ? <ActivityIndicator color={theme.color.primary} style={[styles.iconStyle as any, props.iconStyle]} /> : null}
            {props.children ? <Text numberOfLines={props.numberOfLines} ellipsizeMode={props.ellipsizeMode} style={[styles.btnText, props.btnText]}>{props.children}</Text> : null}
        </TouchableOpacity>
    );
});


const useStyles = (props: React.PropsWithChildren<propTypes>) => {
    const theme = useSelector((store: RootState) => store.theme);
    const contentColor: string = useMemo(() => {
        if (props.style?.backgroundColor && props.style?.color) {
            return props.style?.color
        } else if (props.outline) {
            return props.style?.color || theme.color.primary
        }
        else {
            return theme.color.black;
        }
    }, [props, theme]);

    return useMemo(() => StyleSheet.create({
        container: {
            borderColor: props.style?.color || theme.color.primary,
            borderWidth: moderateScale(1),
            backgroundColor: props.outline ? "transparent" : (props.style?.color || theme.color.primary),
            borderRadius: theme.spacingFactor / 2,
            paddingHorizontal: theme.spacingFactor / 2,
            paddingVertical: props.children ? theme.spacingFactor / 2 : 0,
            marginVertical: theme.spacingFactor / 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'center',
        },
        loadingStyle: {
            opacity: 0.6,
        },
        iconStyle: {
            color: contentColor,
            fontSize: props.style?.fontSize || theme.fontSize.h4,
        },
        btnText: {
            textAlign: 'center',
            color: contentColor,
            fontSize: props.style?.fontSize || theme.fontSize.h5,
            fontFamily: props.style?.fontFamily || theme.fontFamily.medium,
            marginHorizontal: theme.spacingFactor,
        },
    }), [theme, props, contentColor])
}

Button.defaultProps = {
    children: "",
    onPress: () => null,
    outline: false,
    iconType: IconTypes.MaterialCommunityIcons,
    disabled: false,
}

export default Button;
