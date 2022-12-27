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

const LoginScreen = () => {

  const [showPassword, setShowPassword] = useState(false);
  const styles = useStyles();
  const loginButtonRef = useRef<IButtonRef>(null);
  const emailRef = useRef<IInputRef>(null);
  const passwordRef = useRef<IInputRef>(null);
  const ForgotPassword = () => navigate('ForgotPassword');
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
        navigate('Signup', { email });
      }
    }

    loginButtonRef.current?.showLoader(false);
  }, [ emailRef, passwordRef, dispatch]);

  return (
    <KeyboardAwareScrollView style={styles.screen}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            <Image source={APP_LOGO} />
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
          <TouchableOpacity activeOpacity={0.6} onPress={ForgotPassword}>
            <Text style={[styles.subHeading, styles.forgot]}>Forgot password?</Text>
          </TouchableOpacity>

          <Button
            ref={loginButtonRef}
            outline={false}
            style={styles.btnStyle}
            iconStyle={styles.iconStyle}
            onPress={loginHandler} >
            Sign In
          </Button>

          <Text style={styles.subHeading} onPress={() => navigate('OnBoardBasicInfo')}>
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
      marginVertical: theme.spacingFactor * 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    signinHeading: {
      textAlign: 'left',
      fontSize: theme.fontSize.h1,
      fontFamily: theme.fontFamily.bold,
      color: theme.color.spider,
      marginTop: theme.spacingFactor * 4,
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
