import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, Animated, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import Image from '../Image';
import { RootState } from '../../store/types';
import { IUser } from '../../model/user';

type propTypes = {
    size?: number,
    user?: IUser,
    onLongPress?: (e: GestureResponderEvent) => void,
    onPress?: (e: GestureResponderEvent) => void,
    style?: any,
    activeOpacity?: number,
}

const UserProfileAvatar = React.memo<propTypes>((props) => {
    const styles = useStyles({ size: props.size });
    const user = useSelector((store: RootState) => props.user || store.auth.user);
    const [imageError, setImageError] = useState(false);
    const { activeOpacity = 0.6 } = props;

    const renderAvatar = useMemo(() => {
        if (user?.photoURL && !imageError) {
            return (
                <Image
                    source={{ uri: user.photoURL }}
                    style={styles.imageStyle}
                    onError={() => setImageError(true)}
                />
            );
        }
        return (
            <Text style={styles.avatarText}>
                {user?.displayName?.[0] || "SFS"}
            </Text>
        )

    }, [])

    return (
        <Animated.View style={props.style}>
            <TouchableOpacity style={styles.imageBackground} onLongPress={props.onLongPress} activeOpacity={props.onPress ? activeOpacity : 1} onPress={props.onPress}>
                {renderAvatar}
            </TouchableOpacity>
        </Animated.View>
    );
});

const useStyles = (props: propTypes = {}) => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        userProfileContainer: {
            flex: 0.2,
            alignItems: 'center',
            justifyContent: 'center',
        },
        imageBackground: {
            width: moderateScale(props.size || 35),
            height: moderateScale(props.size || 35),
            backgroundColor: theme.color.primary,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: moderateScale(props.size || 35) / 2,
            resizeMode: 'cover',
            overflow: 'hidden',
            position: 'relative',
        },
        imageStyle: {
            width: '100%',
            height: "100%",
            position: "absolute",
            inset: 0,
            zIndex: 2,
        },
        avatarText: {
            color: theme.color.black,
            fontSize: theme.fontSize.h3,
            zIndex: 1,
            fontFamily: theme.fontFamily.regular,
        },
    }), [props, theme])
}

export default UserProfileAvatar;
