import React, { useCallback, useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Text,
  TouchableOpacity,
} from 'react-native';
import Input, { IInputRef } from '../components/Input';
import Button, { IButtonRef } from '../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { navigate } from '../helper/navigator';
import { emailRegex } from '../constants/regex';
import Image from '../components/Image';
import { AppThunkDispatch, RootState } from '../store/types';
import { APP_LOGO } from '../constants/value';
import auth from '@react-native-firebase/auth';
import { authenticate } from '../store/actions/auth';
import { getDeviceWidth } from '../helper/size';
import { setToast } from '../store/actions/app';
import { ToastTypes } from '../constants/enums';
import Icon from '../components/Icon';

const LoginScreen = () => {

  const [showPassword, setShowPassword] = useState(false);
  const styles = useStyles();
  const loginButtonRef = useRef<IButtonRef>(null);
  const emailRef = useRef<IInputRef>(null);
  const passwordRef = useRef<IInputRef>(null);
  const dispatch = useDispatch<AppThunkDispatch>();

  const loginHandler = useCallback(async () => {
    if (loginButtonRef.current?.isDisabled()) return

    const email = emailRef.current?.value();
    const password = passwordRef.current?.value();

    if (!email) return emailRef.current?.setError("Email is empty")
    if (!emailRegex.test(email)) return emailRef.current?.setError("Email is not valid")
    if (!password) return passwordRef.current?.setError("Password is empty");
    // if (!passwordRegex.test(password)) return passwordRef.current?.setError("Invalid Password");

    Keyboard.dismiss();
    loginButtonRef.current?.showLoader();

    try {
      const userCredentials = await auth().signInWithEmailAndPassword(email, password);
      dispatch(authenticate(userCredentials.user))
    } catch (e: any) {

      if (e.code == 'auth/user-not-found') {
        return navigate('Signup', { email });
      }

      dispatch(setToast({
        text: e.message || "Unable to Sign In",
        type: ToastTypes.error,
        title: "Error Signing In",
      }));
    }

    loginButtonRef.current?.showLoader(false);
  }, [emailRef, passwordRef, dispatch]);

  const onSkipSignin = async () => {
    try {
      const userCredentials = await auth().signInAnonymously();
      dispatch(authenticate(userCredentials.user));
    } catch (e: any) {
      dispatch(setToast({
        title: "Error logging in",
        text: e.message || "Unable to skip login",
        type: ToastTypes.error,
      }))
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.screen}>
      <TouchableOpacity activeOpacity={0.6} onPress={onSkipSignin} style={styles.skipWrapper}>
        <Text style={styles.skipText}>Skip</Text>
        <Icon name="chevron-right" style={styles.skipIcon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={APP_LOGO} style={styles.logoImage} />
          </View>
          <Text style={styles.signinHeading}>
            Sign In
          </Text>
          <Input
            ref={emailRef}
            label="Email"
            placeholder="userid@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            leftIcon={{ name: 'email-outline' }}
          />

          <Input
            ref={passwordRef}
            blurOnSubmit={false}
            onSubmitEditing={loginHandler}
            autoCapitalize="none"
            label="Password"
            placeholder="password"
            leftIcon={{ name: 'lock-outline' }}
            rightIcon={{
              name: showPassword ? 'eye-outline' : 'eye-off-outline',
              onPress: () => setShowPassword(pre => !pre),
            }}
            secureTextEntry={!showPassword}
          />
          {/* <TouchableOpacity activeOpacity={0.6} onPress={ForgotPassword}>
            <Text style={[styles.subHeading, styles.forgot]}>Forgot password?</Text>
          </TouchableOpacity> */}

          <Button
            ref={loginButtonRef}
            outline={false}
            style={styles.btnStyle}
            iconStyle={styles.iconStyle}
            onPress={loginHandler} >
            Sign In
          </Button>

          <Text style={styles.subHeading} onPress={() => navigate('Signup')}>
            Don't have an account ? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </View>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const useStyles = () => {
  const theme = useSelector((store: RootState) => store.theme);

  return useMemo(() => StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background.color,
      position: 'relative',
    },
    skipWrapper: {
      position: 'absolute',
      top: theme.spacingFactor * 4,
      right: theme.spacingFactor * 2,
      flexDirection: 'row',
      zIndex: 1,
      alignItems: 'center',
    },
    skipText: {
      color: theme.color.spider,
      fontFamily: theme.fontFamily.medium,
      fontSize: theme.fontSize.h5,
    },
    skipIcon: {
      color: theme.color.spider,
      fontSize: theme.fontSize.h4,
    },
    logoImage: {
      width: getDeviceWidth() * 0.65,
      height: getDeviceWidth() * 0.65,
    },
    backdrop: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    innerContainer: {
      width: "90%",
      marginBottom: theme.spacingFactor,
    },
    inputContainer: {

    },
    logoContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    signinHeading: {
      textAlign: 'left',
      fontSize: theme.fontSize.h1,
      fontFamily: theme.fontFamily.bold,
      color: theme.color.spider,
      marginBottom: theme.spacingFactor * 2,
    },
    forgot: {
      alignSelf: 'flex-end',
      marginVertical: theme.spacingFactor,
    },
    subHeading: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.body,
      color: theme.color.gray1,
      textAlign: 'center',
    },
    subHeading2: {
      color: theme.color.primary,
      fontSize: theme.fontSize.body,
      fontFamily: theme.fontFamily.regular,
    },
    btnStyle: {
      marginVertical: theme.spacingFactor * 2,
    },
    signupLink: {
      color: theme.color.primary,
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.body,
    },
    iconStyle: {
      color: theme.color.white,
    },
  }), [theme])
};

export default LoginScreen;
