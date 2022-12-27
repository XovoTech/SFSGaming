import React, { useMemo } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StyleProp,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { goBack } from '../../helper/navigator';
import { RootState } from '../../store/types';
import Icon from '../Icon';

type propTypes = {
    style?: StyleProp<any>,
    showBack?: boolean,
}

const AuthHeader = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const { showBack = true } = props;
    return (
        <View style={[styles.container, props.style]}>
            {showBack ? (
                <TouchableOpacity style={styles.iconWrapper} activeOpacity={0.6} onPress={goBack}>
                    <Icon name="arrow-left" style={styles.icon} />
                </TouchableOpacity>
            ) : null}
            {/* <Image source={Images.authHeader} style={styles.headerImage} /> */}
        </View>
    );
});

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);
    return useMemo(() => StyleSheet.create({
        container: {
            backgroundColor: theme.background.color,
            // height: getDeviceHeight() * 0.1,
            justifyContent: 'space-between',
            flexDirection: 'row',
        },
        iconWrapper: {
            borderRadius: theme.spacingFactor / 2,
            backgroundColor: theme.color.grayBackground3,
            margin: theme.spacingFactor * 2,
            justifyContent: 'center',
            alignItems: 'center',
        },
        icon: {
            fontSize: theme.fontSize.h2,
            color: theme.color.icon3,
            margin: theme.spacingFactor * 1.5,
        },
        headerImage: {
            width: moderateScale(120),
            position:'absolute',
            right: -moderateScale(50),
            top: -moderateScale(40),
            zIndex: 1,
        },
    }), [theme])
};

export default AuthHeader;
