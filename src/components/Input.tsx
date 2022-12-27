import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TextInputProps, TextInput, TouchableOpacity, Text, GestureResponderEvent, StyleProp, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useSelector } from 'react-redux';
import { IconTypes } from '../constants/enums';
import { RootState } from '../store/types';
import Icon from './Icon';

type inputIcon = {
  name?: string;
  component?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<any>;
  type?: IconTypes;
}

interface propTypes extends TextInputProps {
  leftIcon?: inputIcon;
  rightIcon?: inputIcon;
  inputStyle?: StyleProp<any>;
  labelStyle?: StyleProp<any>;
  errorStyle?: StyleProp<any>;
  label?: string;
  value?: string;
  characters?: number;
}

export interface IInputRef extends TextInput {
  setError: React.Dispatch<React.SetStateAction<string>>;
  value: (v?: string) => any;
}

const Input = React.forwardRef<IInputRef, propTypes>((props, ref) => {
  const { style, leftIcon, rightIcon, inputStyle, label, labelStyle, errorStyle, value, characters, ...inputProps } = props;
  const [isFocused, setFocus] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [reminingCount, setRemainingCount] = useState<number>(characters || 0);
  const inputRef = useRef<TextInput>(null);
  const valueRef = useRef<string>("");

  const styleProps = useMemo(() => ({...props, isFocused}), [props, isFocused])
  const styles = useStyles(styleProps);
  const theme = useSelector((store: RootState) => store.theme);
  useImperativeHandle(ref, () => Object.assign(inputRef.current as any, {
    value: (v?: string) => {
      if (v) {
        valueRef.current = v.trim();
        inputRef.current?.setNativeProps({text: v.trim()})
      }
      return valueRef.current || value || ""
    },
    setError,
  }))

  const onFocus = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocus(true);
    if (inputProps.onFocus) inputProps.onFocus(e);
  }, [inputProps])

  const onBlur = useCallback((e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setFocus(false);
    if (inputProps.onBlur) inputProps.onBlur(e);
  }, [inputProps]);

  const onChangeText = useCallback((t: string) => {
    valueRef.current = t;
    setError("");
    if (characters) setRemainingCount(characters - t.length)
    if (inputProps.onChangeText) inputProps.onChangeText(t);
  }, [inputProps, characters]);

  useEffect(() => {
    if (value && valueRef.current != value) {
      valueRef.current = value;
      inputRef.current?.setNativeProps({text: value?.trim()})
    }
  }, [value])

  const renderLeft = useMemo(() => {
    if (leftIcon && leftIcon.name && !leftIcon.component)
      return (
        <TouchableOpacity style={[styles.iconWrapper, styles.leftIconWrapper]} onPress={leftIcon.onPress} activeOpacity={leftIcon.onPress ? 0.6 : 1}>
          <Icon name={leftIcon.name} style={[styles.icon, leftIcon.style]} type={leftIcon.type} />
        </TouchableOpacity>
      )
    else if (leftIcon && leftIcon.component && !leftIcon.name)
      return leftIcon.component
    else
      return null;

  }, [styles, leftIcon])

  const renderRight = useMemo(() => {
    if (rightIcon && rightIcon.name && !rightIcon.component)
      return (
        <TouchableOpacity style={[styles.iconWrapper, styles.rightIconWrapper]} onPress={rightIcon.onPress} activeOpacity={rightIcon.onPress ? 0.6 : 1}>
          <Icon name={rightIcon.name} style={[styles.icon, rightIcon.style]} type={rightIcon.type} />
        </TouchableOpacity>
      )
    else if (rightIcon && rightIcon.component && !rightIcon.name)
      return rightIcon.component
    else
      return null;

  }, [styles, rightIcon])

  return (
    <>
      {label ? <Text style={[styles.textLabel, labelStyle]}>{label}</Text> : null}
      <View style={[styles.container, error ? styles.error : null, style]}>
        {renderLeft}
        <TextInput
          style={[styles.roundedInput, inputStyle]}
          {...inputProps}
          // value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
          placeholderTextColor={theme.color.placeholderColor}
        />
        {renderRight}
      </View>
      {error ? (
        <Text style={[styles.error, errorStyle]}>{error}</Text>
      ) : null}
      {characters ? <Text style={styles.characterRemaining}>{reminingCount} characters remaining</Text> : null}
    </>
  );
});

type StyleProps = { isFocused: boolean } & propTypes

const useStyles = (props: StyleProps) => {
  const theme = useSelector((store: RootState) => store.theme);
  return useMemo(() => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: props.multiline ? 'flex-start' : 'center',
      borderWidth: 1,
      borderRadius: theme.spacingFactor / 2,
      backgroundColor: theme.background.color,
      borderColor: props.isFocused ? theme.color.primary : theme.color.border,
      marginTop: theme.spacingFactor,
      marginBottom: theme.spacingFactor / 2,
    },
    roundedInput: {
      alignItems: 'flex-start',
      flex: 1,
      padding: theme.spacingFactor,
      fontSize: theme.fontSize.body,
      fontFamily: theme.fontFamily.regular,
      textAlignVertical: props.multiline ? 'top' : 'auto',
      color:theme.color.spider,

    },
    iconWrapper: {
      alignItems: 'center',
      margin: theme.spacingFactor,
    },
    rightIconWrapper: {
      marginLeft:0,
    },
    leftIconWrapper: {
      marginRight: 0,
    },
    icon: {
      fontSize: theme.fontSize.h4,
      color: theme.color.gray1,
    },
    textLabel: {
      color: theme.color.gray1,
      fontSize: theme.fontSize.body,
      marginTop: theme.spacingFactor,
      fontFamily: theme.fontFamily.regular,
    },
    error: {
      color: theme.color.error,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.caption,
      borderColor: theme.color.error,
    },
    characterRemaining: {
      textAlign:'right',
      fontFamily: theme.fontFamily.medium,
      color: theme.color.gray1,
      fontSize: theme.fontSize.caption,
    },
  }), [theme, props])
};

export default Input;
