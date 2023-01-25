import React, { useMemo, useRef } from 'react';
import AppModal, { IModalRef } from './Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import { Linking, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Button from './Button';
import Icon from './Icon';
import { IconTypes } from '../constants/enums';
import { TUTORIAL_LINK, TUTORIAL_THUMBNAIL } from '../constants/value';

const EditModalTutorial = () => {
    const modalRef = useRef<IModalRef>(null);
    const styles = useStyles();

    const onCancel = () => {
        modalRef.current?.showModal(false)
    }

    const onWatchNow = () => {
        Linking.openURL(TUTORIAL_LINK);
    }

    const onOpenModal = () => {
        modalRef.current?.showModal(true);
    }

    return (
        <React.Fragment>
            <TouchableOpacity activeOpacity={0.6} onPress={onOpenModal} >
                <Icon style={styles.questionIcon} name='progress-question' type={IconTypes.MaterialCommunityIcons} />
            </TouchableOpacity>
            <AppModal style={styles.container} ref={modalRef}>
                    <View style={styles.textContainer}>
                        <Text style={styles.textHeading}>Don't know how to edit BP?</Text>
                        <Text style={styles.textHeading}>Watch this video to learn:-</Text>
                    </View>
                    <TouchableOpacity onPress={onWatchNow} style={styles.imageWrapper}>
                        <Image resizeMode='contain' source={{uri: TUTORIAL_THUMBNAIL}} style={styles.thumbnailImage}/>
                    </TouchableOpacity>
                    <View style={styles.buttonWrapper}>
                        <Button style={styles.button} outline onPress={onCancel}>NOT NOW</Button>
                        <Button style={styles.button} outline onPress={onWatchNow}>WATCH NOW</Button>
                    </View>
            </AppModal>
        </React.Fragment>
    )
}

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex:0.5,
            marginHorizontal: theme.spacingFactor * 2,
            flexDirection:'column',
            justifyContent:'flex-start',
            paddingVertical: theme.spacingFactor,
        },
        thumbnailImage: {
            width: "100%",
            height: "100%",
        },
        innerContainer: {
            width:"100%",
            height: "100%",
        },
        textContainer: {
            flex:0.1,
            margin: theme.spacingFactor,
        },
        imageWrapper: {
            flex:0.75,
        },
        questionIcon: {
            color: theme.color.white,
            fontSize: theme.fontSize.h2,
            margin: theme.spacingFactor * 2,
        },
        buttonWrapper: {
            flexDirection: 'row',
            justifyContent:'flex-end',
            alignItems: 'center',
            flex:0.1,
            margin: theme.spacingFactor,
        },
        textHeading: {
            color: theme.color.white,
            fontSize: theme.fontSize.h3,
            fontFamily: theme.fontFamily.regular,
        },
        button: {
            margin: theme.spacingFactor / 2,
        },
    }), [theme])
}

export default EditModalTutorial;
