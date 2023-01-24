import React, { useMemo, useRef } from 'react';
import AppModal, { IModalRef } from './Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from './Button';
import Icon from './Icon';
import { IconTypes } from '../constants/enums';
import Image from './Image';

const EditModalTutorial = () => {
    const modalRef = useRef<IModalRef>(null);
    const styles = useStyles();

    const onCancel = () => {
        modalRef.current?.showModal(false)
    }

    const onWatchNow = () => {
        Linking.openURL("");
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
                <Text style={styles.textHeading}>Don't know how to edit BP?</Text>
                <Text style={styles.textHeading}>Watch this video to learn:-</Text>
                <Image source={{uri: ''}} />
                <View style={styles.buttonWrapper}>
                    <Button outline onPress={onCancel}>NOT NOW</Button>
                    <Button outline onPress={onWatchNow}>WATCH NOW</Button>
                </View>
            </AppModal>
        </React.Fragment>
    )
}

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: theme.color.grayBackground2,
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
        },
        textHeading: {
            color: theme.color.white,
            fontSize: theme.fontSize.h3,
            fontFamily: theme.fontFamily.regular,
        },
    }), [theme])
}

export default EditModalTutorial;
