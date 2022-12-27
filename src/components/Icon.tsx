import React, { useImperativeHandle, useMemo, useState } from 'react';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import Foundation from 'react-native-vector-icons/Foundation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Zocial from 'react-native-vector-icons/Zocial';
import { IconProps } from 'react-native-vector-icons/Icon';
import { IconTypes } from '../constants/enums';
import { ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

type propTypes = {
    type?: IconTypes,
} & IconProps;

export interface IIconRef {
    setLoader: React.Dispatch<React.SetStateAction<boolean>>,
}

const Icon = React.forwardRef<IIconRef, propTypes>((props, ref) => {
    const [loader, setLoader] = useState<boolean>(false);
    const theme = useSelector((store: RootState) => store.theme);
    const {type, ...iconProps} = props;

    useImperativeHandle(ref, () => {
        return {
            setLoader,
        }
    }, [])

    const IconComponent: any = useMemo(() => {
        switch (type){
            case IconTypes.AntDesign:
                return AntDesign;
            case IconTypes.Entypo:
                return Entypo;
            case IconTypes.EvilIcons:
                return EvilIcons;
            case IconTypes.Feather:
                return Feather;
            case IconTypes.Fontisto:
                return Fontisto;
            case IconTypes.FontAwesome:
                return FontAwesome;
            case IconTypes.FontAwesome5:
                return FontAwesome5;
            case IconTypes.FontAwesome5Pro:
                return FontAwesome5Pro;
            case IconTypes.Foundation:
                return Foundation;
            case IconTypes.Ionicons:
                return Ionicons;
            case IconTypes.MaterialCommunityIcons:
                return MaterialCommunityIcons;
            case IconTypes.MaterialIcons:
                return MaterialIcons;
            case IconTypes.Octicons:
                return Octicons;
            case IconTypes.SimpleLineIcons:
                return SimpleLineIcons;
            case IconTypes.Zocial:
                return Zocial;
            default:
                return MaterialCommunityIcons;
        }
    }, [type]);

    if (loader)
        return <ActivityIndicator color={theme.color.secondary} size="small" />

    return <IconComponent {...iconProps} brand/>
})

Icon.defaultProps = {
    type: IconTypes.MaterialCommunityIcons,
}

export default Icon;
