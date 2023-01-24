import { useRoute } from '@react-navigation/native';
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, TextInput, View, ScrollView } from 'react-native';
import { exists, readFile, writeFile } from 'react-native-fs';
import { useDispatch, useSelector } from 'react-redux';
import Button, { IButtonRef } from '../components/Button';
import Header from '../components/Header';
import { AppThunkDispatch, RootState } from '../store/types';
import { setToast } from '../store/actions/app';
import { ToastTypes } from '../constants/enums';
import EditModalTutorial from '../components/EditTutorialModal';

const Edit = () => {
    const [height, setHeight] = useState<number>();
    const [content, setContent] = useState<string>("");
    const saveBtnRef = useRef<IButtonRef>(null);
    const styles = useStyles();
    const dispatch = useDispatch<AppThunkDispatch>();
    const { params } = useRoute<any>();

    const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

    const loadAsset = useCallback(async () => {
        const { path } = params;
        if (path && await exists(path)) {
            try {
                setContent(await readFile(path));
            } catch (e: any) {
                dispatch
            }
        }
    }, [params, dispatch]);

    useEffect(() => {
        loadAsset()
    }, [loadAsset])

    const renderCustomRight = useMemo(() => {
        const { path, key } = params;
        if (!path || !key) return <React.Fragment>{null}</React.Fragment>;

        const onSave = async () => {
            saveBtnRef.current?.showLoader(true);
            try {
                // await storage().ref(SFS_GAMING_BPS).child(key).child(BLUE_PRINT_FILENAME).putString(content);
                await writeFile(path, content);
                dispatch(setToast({
                    title: "Success",
                    type: ToastTypes.success,
                    text: "Successfully updated file",
                }))
            } catch (e: any) {
                dispatch(setToast({
                    title: "Error saving content",
                    type: ToastTypes.error,
                    text: e.message || "Unable to save content",
                }))
            }
            saveBtnRef.current?.showLoader(false);
        };

        return (
            <React.Fragment>
                <EditModalTutorial />
                <Button ref={saveBtnRef} onPress={onSave}>Save</Button>
            </React.Fragment>
        )
    }, [content, dispatch, params])

    return (
        <>
            <Header title="Edit" showBack showDrawer={false} renderCustomRight={renderCustomRight} />
            <View onLayout={onLayout} style={styles.container}>
                <ScrollView keyboardDismissMode='interactive'>
                    <TextInput
                        multiline
                        autoFocus
                        value={content}
                        onChangeText={setContent}
                        textAlignVertical='top'
                        style={[styles.textInput, { height }]}
                    />
                </ScrollView>
            </View>
        </>
    )
}

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.color,
            alignItems: 'stretch',
            justifyContent: 'flex-start',
        },
        textInput: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.body,
            color: theme.color.spider,
        },
    }), [theme])
}

export default Edit;
