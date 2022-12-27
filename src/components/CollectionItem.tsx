import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, View, ViewStyle, StyleProp, Text, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { useSelector } from 'react-redux';
import { IBPSInfo } from '../model/bps';
import { RootState } from '../store/types';
import Button from './Button';
import Icon, { IIconRef } from './Icon';
import Image from './Image';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import { BPS_KEY } from '../constants/value';
import { IUser } from '../model/user';

type propTypes = {
    style?: StyleProp<ViewStyle>;
    collection: IBPSInfo
}

const CollectionItem = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const theme = useSelector((store: RootState) => store.theme);
    const user = useSelector((store: RootState) => store.auth.user);
    const likeIconRef = useRef<IIconRef>(null);
    const dislikeIconRef = useRef<IIconRef>(null);
    const { data: image_uri, isLoading } = useQuery({
        queryKey: [BPS_KEY, props.collection.key, props.collection.image], queryFn: async () => {
            return await storage().ref(BPS_KEY).child(props.collection.key).child(props.collection.image).getDownloadURL();
        },
    })

    const onOpen = () => {
        if (props.collection.bpLink) {
            Linking.openURL(props.collection.bpLink);
        }
    }

    const onLike = () => {
        likeIconRef.current?.setLoader(true);
        if (!user) return likeIconRef.current?.setLoader(false);
        const likerDataRef = database().ref(BPS_KEY).child(props.collection.key).child('likers');
        likerDataRef.once('value', snapshot => {
            let values: Array<IUser['uid']> = snapshot.val() || [];
            if (values.includes(user.uid)) {
                values = values.filter(v => v !== user.uid);
            } else {
                values.push(user.uid);
            }
            likerDataRef.set(values);
            likeIconRef.current?.setLoader(false)
        })
    }

    const onDislike = () => {
        dislikeIconRef.current?.setLoader(true);
        if (!user) return dislikeIconRef.current?.setLoader(false);
        const dislikerDataRef = database().ref(BPS_KEY).child(props.collection.key).child('dislikers');
        dislikerDataRef.once('value', snapshot => {
            let values: Array<IUser['uid']> = snapshot.val() || [];
            if (values.includes(user.uid)) {
                values = values.filter(v => v !== user.uid);
            } else {
                values.push(user.uid);
            }
            dislikerDataRef.set(values)
            dislikeIconRef.current?.setLoader(false)
        })
    }

    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.collectionImage}>
                {
                    isLoading ? (
                        <ActivityIndicator color={theme.color.primary} size="large" />
                    ) : (
                        <Image source={{ uri: image_uri }} />
                    )
                }
            </View>
            <View style={styles.metaContentContainer}>
                <Text style={styles.titleText}>{props.collection.name}</Text>
                <Button onPress={onOpen} disabled={!props.collection.bpLink}>OPEN</Button>
                <View style={styles.feedbackContainer}>
                    <TouchableOpacity activeOpacity={0.6} style={styles.iconWrapper} onPress={onLike}>
                        <Icon ref={likeIconRef} style={styles.icon} name="thumb-up-outline" />
                        <Text style={styles.iconValue}>{props.collection.likers?.length || "0"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} style={styles.iconWrapper} onPress={onDislike}>
                        <Text style={styles.iconValue}>{props.collection.dislikers?.length || "0"}</Text>
                        <Icon ref={dislikeIconRef} style={styles.icon} name="thumb-down-outline" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
})

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: theme.spacingFactor,
            marginHorizontal: theme.spacingFactor * 1.5,
            marginVertical: theme.spacingFactor,
            borderRadius: theme.spacingFactor,
            backgroundColor: theme.color.grayBackground2,
        },
        collectionImage: {
            flex: 0.3,
            marginRight: theme.spacingFactor,
            alignItems: 'center',
            justifyContent:'center',
        },
        metaContentContainer: {
            flex: 0.7,
        },
        titleText: {
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.fontSize.h3,
            color: theme.color.spider,
        },
        feedbackContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
        },
        iconWrapper: {
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
        },
        icon: {
            color: theme.color.spider,
            padding: theme.spacingFactor,
            fontSize: theme.fontSize.h2,
        },
        iconValue: {
            fontSize: theme.fontSize.body,
            color: theme.color.spider,
        },
    }), [theme])
}

export default CollectionItem;
