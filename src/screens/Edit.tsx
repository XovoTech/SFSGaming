import { useRoute } from '@react-navigation/native';
import React, { useMemo, useState, useRef } from 'react';
import { LayoutChangeEvent, StyleSheet, TextInput, View, ScrollView, ActivityIndicator } from 'react-native';
import { writeFile } from 'react-native-fs';
import { useDispatch, useSelector } from 'react-redux';
import Button, { IButtonRef } from '../components/Button';
import Header from '../components/Header';
import { AppThunkDispatch, RootState } from '../store/types';
import { setToast } from '../store/actions/app';
import { ToastTypes } from '../constants/enums';
import EditModalTutorial from '../components/EditTutorialModal';
import { useQuery } from '@tanstack/react-query';
import { getBlueprintDirPath } from '../helper/utility';
import RNFS from 'react-native-fs';

const Edit = () => {
    const [height, setHeight] = useState<number>();
    const [editedContent, setContent] = useState<string>("");
    const saveBtnRef = useRef<IButtonRef>(null);
    const styles = useStyles();
    const dispatch = useDispatch<AppThunkDispatch>();
    const { params } = useRoute<any>();
    const theme = useSelector((store: RootState) => store.theme);

    const { data: content, isLoading } = useQuery({
        queryKey: [params.name], queryFn: async () => {
            if (params.name) {
                const path = await getBlueprintDirPath();
                const fileContent = await RNFS.readFile(`${path}/${params.name}/Blueprint.txt`, 'utf8');
                return fileContent;
            }
            return "";
        },
        enabled: !!params.name,
    });


    const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

    const renderCustomRight = useMemo(() => {

        const onSave = async () => {
            saveBtnRef.current?.showLoader(true);
            try {
                // await storage().ref(SFS_GAMING_BPS).child(key).child(BLUE_PRINT_FILENAME).putString(content);

                if (params.name) {
                    const path = await getBlueprintDirPath();
                    await writeFile(`${path}/${params.name}/Blueprint.txt`, editedContent || content || "");
                    dispatch(setToast({
                        title: "Success",
                        type: ToastTypes.success,
                        text: "Successfully updated file",
                    }))
                }
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
    }, [content, dispatch, params, editedContent])

    return (
        <>
            <Header title="Edit" showBack showDrawer={false} renderCustomRight={renderCustomRight} />
            <View onLayout={onLayout} style={styles.container}>
                <ScrollView keyboardDismissMode='interactive'>
                    {
                        isLoading ? (
                            <View style={styles.screen} >
                                <ActivityIndicator size="large" color={theme.color.primary} />
                            </View>
                        ) : (
                            <TextInput
                                multiline
                                autoFocus
                                value={editedContent || content}
                                onChangeText={setContent}
                                textAlignVertical='top'
                                style={[styles.textInput, { height }]}
                            />
                        )
                    }
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
        screen: {
            flex: 1,
            position: 'relative',
        },
    }), [theme])
}

export default Edit;
