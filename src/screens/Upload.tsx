import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import Button from '../components/Button';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { IconTypes } from '../constants/enums';
import { RootState } from '../store/types';
import ImagePicker, { Image as ImageResponse, Options } from 'react-native-image-crop-picker';
import Input, { IInputRef } from '../components/Input';
import { IBPSInfo } from '../model/bps';
import moment from 'moment';
import { nanoid } from 'nanoid';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import { BPS_KEY } from '../constants/value';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Image from '../components/Image';
import { moderateScale } from 'react-native-size-matters';

const rules = [
    'Name and Image must be appropriate and related to SFS.',
    'BP file must be according to the name given.',
    'No multiple uploads of the same thing.',
    'No advertising.',
]

const Upload = () => {
    const styles = useStyles();
    const user = useSelector((store: RootState) => store.auth.user);
    const titleRef = useRef<IInputRef>(null);
    const linkRef = useRef<IInputRef>(null);
    const [imageResponse, setImageResponse] = useState<ImageResponse>();

    const onBrowseImage = async () => {
        const options: Options = {
            mediaType: 'photo',
            multiple: false,
        };
        const response = await ImagePicker.openPicker(options)
        setImageResponse(response);
    }

    const onUpload = async () => {
        if (!user) return;

        const key = nanoid();

        if (imageResponse) {
            await storage().ref(BPS_KEY).child(key).putFile(imageResponse.path);
        }

        const data: IBPSInfo = {
            date: moment().toISOString(),
            ownerUid: user.uid,
            name: titleRef.current?.value(),
            key,
            image: imageResponse?.filename || "",
            bpLink: linkRef.current?.value(),
        }

        await database().ref(BPS_KEY).child(key).set(data);
    }

    return (
        <KeyboardAwareScrollView style={styles.screen}>
            <Header title='Upload' showBack={false} />
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {
                        imageResponse ? (
                            <Image style={styles.previewImage} source={{uri: imageResponse.path}} />
                        ) : (
                            <Icon style={styles.imageIcon} name="image-not-supported" type={IconTypes.MaterialIcons} />
                        )
                    }
                    <Button onPress={onBrowseImage}>Browse Image</Button>
                </View>
                <Input
                    style={styles.input}
                    placeholder="Title"
                    autoCapitalize="none"
                    returnKeyType="search"
                    blurOnSubmit={false}
                    ref={titleRef}
                    leftIcon={{ name: 'file-document-edit-outline' }} />
                <Input
                    ref={linkRef}
                    style={styles.input}
                    placeholder="BP Link"
                    autoCapitalize="none"
                    returnKeyType="search"
                    blurOnSubmit={false}
                    leftIcon={{ name: 'link-variant' }} />
                <Text style={styles.ruleTextHeading}>Rules:</Text>
                <View style={styles.textContainer}>
                    {rules.map((rule: string, index: number) => (
                        <Text key={rule} style={styles.ruleText}>{`${index + 1}) ${rule}`}</Text>
                    ))}
                </View>
                <Button onPress={onUpload}>Upload</Button>
            </View>
        </KeyboardAwareScrollView>
    )
}

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        screen: {
            flex:1,
            flexDirection:'column',
            backgroundColor: theme.background.color,
        },
        container: {
            flex: 1,
            padding: theme.spacingFactor,
            justifyContent:'space-evenly',
        },
        imageContainer: {
            justifyContent:'center',
            alignItems:'center',
            marginVertical: theme.spacingFactor,
        },
        imageIcon: {
            fontSize: theme.fontSize.h1 * 3,
            color: theme.color.spider,
        },
        input: {

        },
        ruleTextHeading: {
            color: theme.color.spider,
            fontSize: theme.fontSize.h5,
            marginTop: theme.spacingFactor,
        },
        ruleText: {
            color: theme.color.spider,
            fontSize: theme.fontSize.tabLabel,
        },
        textContainer: {
            marginVertical: theme.spacingFactor / 2,
        },
        previewImage: {
            height: moderateScale(150),
            width: moderateScale(150),
        },
    }), [theme])
}

export default Upload;
