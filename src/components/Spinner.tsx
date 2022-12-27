import React, { useEffect, useMemo } from 'react';
import { useImperativeHandle } from 'react';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View, StyleProp, ActivityIndicatorProps } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

type propTypes = {
    loader?: boolean;
    style?: StyleProp<any>;
    size?: ActivityIndicatorProps['size']
}

export interface ISpinnerRef {
    setLoader: React.Dispatch<React.SetStateAction<boolean>>
}

const Spinner = React.forwardRef<ISpinnerRef, React.PropsWithChildren<propTypes>>((props, ref) => {
    const [loader, setLoader] = useState(props.loader || false);
    const styles = useStyles();
    const theme = useSelector((store: RootState) => store.theme);

    useEffect(() =>{
        setLoader(l => props.loader || l)
    },[props.loader])

    useImperativeHandle(ref, () => {
        return {
            setLoader,
        };
    }, [])

    if (!loader) return null;

    return (
        <View style={[styles.container, props.style]}>
            <ActivityIndicator size={props.size || "large"} color={[theme.color.primary, theme.color.secondary] as any} />
            {props.children}
        </View>
    )
})

const useStyles = () => {
    return useMemo(() => StyleSheet.create({
        container: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "rgba(0,0,0,0.5)",
        },
    }),[])
};

export default Spinner;
