import React, { useImperativeHandle, useState, useMemo } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Modal,
    Animated,
    NativeSyntheticEvent,
    ModalProps,
    StyleProp,
    GestureResponderEvent,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

type propTypes = {
    onBackdropPress?: (e: NativeSyntheticEvent<any>)=>void;
    animationType?: ModalProps['animationType'];
    overlayContainer?: StyleProp<any>;
    onPress?: (e: GestureResponderEvent) => void;
    style?: StyleProp<any>;
}

export interface IModalRef {

}

const AppModal = React.forwardRef<IModalRef, React.PropsWithChildren<propTypes>>((props, ref) => {
    const [modalVisible, setModalVisibility] = useState(false);
    const styles = useStyles();

    useImperativeHandle(ref, () => {
        return {
            showModal: setModalVisibility,
        };
    });

    const onBackdropPress = async (e: NativeSyntheticEvent<any>) => {
        setModalVisibility(false);
        if (props.onBackdropPress) props.onBackdropPress(e)
    };

    const onInnerContainerPress = (e: GestureResponderEvent) => {
        e.stopPropagation();
        if (props.onPress) props.onPress(e);
    };

    return (
        <Modal
            animationType={props.animationType}
            transparent={true}
            visible={modalVisible}
            onRequestClose={onBackdropPress}>
                <Animated.View style={[styles.overlayContainer,props.overlayContainer]}>
                    <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onBackdropPress}>
                        <TouchableOpacity activeOpacity={props.onPress ? 0.6 : 1} onPress={onInnerContainerPress} style={[styles.modalInnerContainer, props.style]}>
                            {props.children}
                        </TouchableOpacity>
                    </TouchableOpacity>
                </Animated.View>
        </Modal>
    )
});

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        overlayContainer: {
            position: "absolute",
            bottom: 0,
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: `${theme.color.iconBackground}66`,
            flex: 1,
        },
        backdropTouch: {
            width:"100%",
            height: "100%",
            justifyContent: 'flex-end',
        },
        modalInnerContainer: {
            backgroundColor:theme.type == "Light" ? theme.background.color : theme.color.grayBackground3,
            // flex: 0.6,
            paddingHorizontal: theme.spacingFactor * 2,
            borderTopLeftRadius: theme.spacingFactor * 3,
            borderTopRightRadius: theme.spacingFactor * 3,
            justifyContent: 'space-around',
        },
    }), [theme])
};

AppModal.defaultProps = {
    animationType:"slide",
}

export default AppModal;
