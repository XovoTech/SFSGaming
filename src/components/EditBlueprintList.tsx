import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, ListRenderItem, RefreshControl, ActivityIndicator, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from './Input';
import { SFS_GAMING_BPS } from '../constants/value';
import { AppThunkDispatch, RootState } from '../store/types';
import SkeletonSearch from './skeletons/SkeletonSearch';
import { EditType, IconTypes, ToastTypes } from '../constants/enums';
import Icon from './Icon';
import { navigate } from '../helper/navigator';
import RNFS from 'react-native-fs'
import { getBlueprintDirPath } from '../helper/utility';
import { PermissionsAndroid, Platform } from 'react-native';
// import { NativeModules } from 'react-native';
// import { setToast } from '../store/actions/app';
// const PermissionFile = NativeModules.PermissionFile;

type propTypes = {
    style?: StyleProp<any>,
}

const EditBlueprintList = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const [searchInput, setSearchText] = useState<string>("");
    const theme = useSelector((store: RootState) => store.theme);
    // const dispatch = useDispatch<AppThunkDispatch>();

    useEffect(() => {
        if (Platform.OS == 'android') {
            // if (Platform.Version >= 30) {
            //     console.log("OS is 30+")
            //     PermissionFile.checkAndGrantPermission(
            //         (err) => {
            //             console.log(err);
            //             dispatch(setToast({
            //                 title: "Permission denied",
            //                 text: "No permission has been granted",
            //                 type: ToastTypes.error,
            //             }))
            //         },
            //         (res: any) => {
            //             if (res) {
            //                 console.log(res);
            //             }
            //         },
            //     );
            // } else {
            //     PermissionsAndroid.request(
            //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            //         // (isAllow) => {
            //         //     if (isAllow) {
            //         //         dispatch(setToast({
            //         //             title: "Permission Allowed",
            //         //             text: "permission has been granted",
            //         //             type: ToastTypes.success,
            //         //         }))
            //         //     } else {
            //         //         dispatch(setToast({
            //         //             title: "Sorry",
            //         //             text: "Access not granted",
            //         //             type: ToastTypes.error,
            //         //         }))
            //         //     }
            //         // },
            //     );
            // }
            const permissions = [
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]
            PermissionsAndroid.requestMultiple(permissions);
        }
    });

    const { data, isLoading } = useQuery({
        queryKey: [SFS_GAMING_BPS], queryFn: async () => {
            const path = await getBlueprintDirPath();
            const dirs = await RNFS.readDir(path);
            return dirs.map(dir => dir.name);
        },
    });

    const renderListEmptyComponent = useMemo(() => {
        if (isLoading)
            return (
                <React.Fragment>
                    {[...Array(6).keys()].map(index => <SkeletonSearch stretch key={index} />)}
                </React.Fragment>
            )
        else
            return (
                <View style={styles.noResultWrapper}>
                    <Text style={styles.noResultText}>{searchInput ? `No video found for "${searchInput}"` : "No Video found!"}</Text>
                </View>
            )
    }, [styles, isLoading, searchInput]);

    const renderItem: ListRenderItem<any> = ({ item }) => {
        return (
            <EditBlueprintItem name={item} />
        )
    }

    const filterItem = (item: string) => {
        if (!searchInput) return true;
        return item.toLowerCase().includes(searchInput.toLowerCase());
    }

    return (
        <View style={[styles.container, props.style]}>
            <Input
                style={styles.input}
                placeholder="Search"
                autoCapitalize="none"
                returnKeyType="search"
                blurOnSubmit={false}
                onChangeText={setSearchText}
                leftIcon={{ name: 'magnify' }}
            />
            <FlatList
                data={data?.filter(filterItem) || []}
                renderItem={renderItem}
                style={styles.flatList}
                keyExtractor={(item, i) => `${i}`}
                initialNumToRender={8}
                removeClippedSubviews={true}
                maxToRenderPerBatch={100}
                windowSize={7}
                contentContainerStyle={styles.contentContainer}
                ListEmptyComponent={renderListEmptyComponent}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={{ paddingVertical: theme.spacingFactor * 5 }}>
                        {isLoading ? <ActivityIndicator size="small" color={theme.color.primary} /> : null}
                    </View>
                }
                // onEndReached={onEndReached}
                onEndReachedThreshold={0.7}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        colors={[theme.color.primary, theme.color.secondary]}
                        tintColor={theme.color.primary} />
                }
            />
        </View>
    )
});

type listPropTypes = {
    style?: StyleProp<ViewStyle>;
    name: string
}

const EditBlueprintItem = React.memo<listPropTypes>(({ name, style }) => {
    const styles = useStyles();

    const onEditBlueprint = async () => {
        navigate("Edit", { name, type: EditType.Blueprint });
    }

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={onEditBlueprint} style={[styles.listContainer, style]}>
            <Icon name="file-text" type={IconTypes.Feather} style={styles.fileIcon} />
            <Text style={styles.blueprintText}>{name}</Text>
        </TouchableOpacity>
    )
})

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
        },
        input: {
            margin: theme.spacingFactor * 1.5,
        },
        contentContainer: {
            minHeight: "100%",
        },
        noResultWrapper: {
            height: "100%",
            justifyContent: 'center',
            alignItems: 'center',
        },
        noResultText: {
            color: theme.color.spider,
            fontSize: theme.fontSize.h4,
            fontFamily: theme.fontFamily.bold,
        },
        flatList: {
            marginTop: theme.spacingFactor,
        },
        listContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.spacingFactor,
            marginHorizontal: theme.spacingFactor * 1.5,
            marginVertical: theme.spacingFactor,
            borderRadius: theme.spacingFactor,
            backgroundColor: theme.color.grayBackground2,
        },
        fileIcon: {
            fontSize: theme.fontSize.h2,
            color: theme.color.white,
            alignItems: 'center',
            justifyContent: 'center',
            margin: theme.spacingFactor,
        },
        blueprintText: {
            flex: 1,
            color: theme.color.white,
        },
        titleText: {
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.fontSize.h3,
            color: theme.color.spider,
        },
    }), [theme])
}

export default EditBlueprintList;
