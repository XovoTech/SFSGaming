import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, StyleProp } from 'react-native';
import { useSelector } from 'react-redux';
import UserProfileAvatar from './profile/UserProfileAvatar';
import { RootState } from '../store/types';

type propTypes = {
    style?: StyleProp<any>;
}

const DrawerProfile = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const user = useSelector((store: RootState) => store.auth.user);

    return (
        <TouchableOpacity activeOpacity={0.6} style={[styles.container, props.style]}>
            <UserProfileAvatar size={44} style={styles.avatarWrapper} />
            <View style={styles.rightSectionContainer}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={styles.userNameText}>{user?.displayName || "SFS Gamer"}</Text>
            </View>
        </TouchableOpacity>
    );
});

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme)
    return useMemo(() => StyleSheet.create({
        container: {
            flexDirection: "row",
            width:'100%',
        },
        avatarWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        rightSectionContainer: {
            justifyContent: 'center',
            margin: theme.spacingFactor,
        },
        userNameText: {
            color: theme.color.spider,
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.h3,
        },
        userActionContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        userActionText: {
            marginTop: theme.spacingFactor / 3,
            fontFamily: theme.fontFamily.medium,
            color:theme.color.gray1,
            fontSize: theme.fontSize.caption,
        },
    }), [theme]);
};

export default DrawerProfile;
