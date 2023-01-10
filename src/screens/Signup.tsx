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

const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const styles = useStyles();
    const signupButtonRef = useRef<IButtonRef>(null);
    const emailRef = useRef<IInputRef>(null);
    const passwordRef = useRef<IInputRef>(null);
    const confirmPasswordRef = useRef<IInputRef>(null);
    const nameRef = useRef<IInputRef>(null);
    const dispatch = useDispatch<AppThunkDispatch>();

    const registerHandler = useCallback(async () => {
        if (signupButtonRef.current?.isDisabled()) return

        const email = emailRef.current?.value();
        const password = passwordRef.current?.value();
        const confirmPassword = confirmPasswordRef.current?.value();
        const name = nameRef.current?.value();

        if (!email) return emailRef.current?.setError("Email is empty")
        if (!emailRegex.test(email)) return emailRef.current?.setError("Email is not valid")
        if (!password) return passwordRef.current?.setError("Password is empty");
        if (password !== confirmPassword) return confirmPasswordRef.current?.setError("Confirm Password does not match");
        // if (!passwordRegex.test(password)) return passwordRef.current?.setError("Invalid Password");

        Keyboard.dismiss();
        signupButtonRef.current?.showLoader();

        try {
            const userCredentials = await auth().createUserWithEmailAndPassword(email, password);
            await userCredentials.user.updateProfile({ displayName: name });
            dispatch(authenticate(userCredentials.user))
        } catch (e: any) {
            dispatch(setToast({
                text: e.message || "Unable to Sign In",
                type: ToastTypes.error,
                title: "Error Signing In",
            }));
        }

        signupButtonRef.current?.showLoader(false);
    }, [emailRef, passwordRef, dispatch]);

    return (
        <KeyboardAwareScrollView style={styles.screen}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={Keyboard.dismiss}>
                <View style={styles.innerContainer}>
                    <View style={styles.logoContainer}>
                        <Image source={APP_LOGO} style={styles.logoImage} />
                    </View>
                    <Text style={styles.signupHeading}>
                        Register
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
                            nameRef.current?.focus();
                        }}
                        leftIcon={{ name: 'email-outline' }}
                    />

                    <Input
                        ref={nameRef}
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            passwordRef.current?.focus();
                        }}
                        autoCapitalize="none"
                        returnKeyType='next'
                        label="Name"
                        placeholder="John Doe"
                        leftIcon={{
                            name: 'account-outline',
                        }}
                    />

                    <Input
                        ref={passwordRef}
                        blurOnSubmit={false}
                        onSubmitEditing={() => {
                            confirmPasswordRef.current?.focus();
                        }}
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

                    <Input
                        ref={confirmPasswordRef}
                        blurOnSubmit={false}
                        onSubmitEditing={registerHandler}
                        autoCapitalize="none"
                        label="Confirm Password"
                        placeholder="confirm password"
                        leftIcon={{ name: 'lock-outline' }}
                        rightIcon={{
                            name: showConfirmPassword ? 'eye-outline' : 'eye-off-outline',
                            onPress: () => setShowConfirmPassword(pre => !pre),
                        }}
                        secureTextEntry={!showConfirmPassword}
                    />

                    <Button
                        ref={signupButtonRef}
                        outline={false}
                        style={styles.btnStyle}
                        iconStyle={styles.iconStyle}
                        onPress={registerHandler} >
                        Register
                    </Button>

                    <Text style={styles.subHeading} onPress={() => navigate('Login')}>
                        Already have an account ? <Text style={styles.signupLink}>Sign In</Text>
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
        logoImage: {
            width: getDeviceWidth() * 0.65,
            height: getDeviceWidth() * 0.65,
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
        signupHeading: {
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

export default Signup;
