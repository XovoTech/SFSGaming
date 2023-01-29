import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, FlatList, ListRenderItem, RefreshControl, ActivityIndicator, Text, StyleProp, ViewStyle, Linking } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from './Input';
import { BLUE_PRINT_FILENAME, SFS_GAMING_BPS } from '../constants/value';
import { AppThunkDispatch, RootState } from '../store/types';
import database from '@react-native-firebase/database';
import { IGamingBPS } from '../model/bps';
import SkeletonSearch from './skeletons/SkeletonSearch';
import storage from '@react-native-firebase/storage';
import Button, { IButtonRef } from './Button';
import Image from './Image';
import { DownloadFileOptions, downloadFile, exists, mkdir } from 'react-native-fs';
import { setToast } from '../store/actions/app';
import { EditType, ToastTypes } from '../constants/enums';
import { getBlueprintDirPath } from '../helper/utility';
import { navigate } from '../helper/navigator';

type propTypes = {
    style?: StyleProp<any>,
}

const GamingVideoList = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const [searchInput, setSearchText] = useState<string>("");
    const theme = useSelector((store: RootState) => store.theme);

    const [data, setData] = useState<{ [key in string]: IGamingBPS }>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        database().ref(SFS_GAMING_BPS).on('value', (snapshot) => {
            setData(snapshot.val());
            setIsLoading(false);
        })
    }, [])

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

    const filterItem = (item: IGamingBPS) => {
        if (!searchInput) return true;
        return item.name.toLowerCase().includes(searchInput.toLowerCase());
    }

    const renderItem: ListRenderItem<IGamingBPS> = ({ item }) => {
        return (
            <VideoListItem collection={item} />
        )
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
                data={Object.values(data || {}).filter(filterItem)}
                renderItem={renderItem}
                style={styles.flatList}
                keyExtractor={(item: IGamingBPS) => `${item.key}`}
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
    collection: IGamingBPS
}

const VideoListItem = React.memo<listPropTypes>((props) => {
    const styles = useStyles();
    const theme = useSelector((store: RootState) => store.theme);
    const downloadBtnRef = useRef<IButtonRef>(null);
    const dispatch = useDispatch<AppThunkDispatch>();
    const [fileExist, setFileExist] = useState<boolean>(false);

    const { data: image_uri, isLoading } = useQuery({
        queryKey: [SFS_GAMING_BPS, props.collection.key, props.collection.image], queryFn: async () => {
            return await storage().ref(SFS_GAMING_BPS).child(props.collection.key).child(props.collection.image).getDownloadURL();
        },
    });

    const onWatch = () => Linking.openURL(props.collection.video);

    const onOpen = async () => {
        navigate("Edit", { name: props.collection.key, type: EditType.Blueprint});
    }

    const checkForLocalFile = useCallback(async () => {
        const path = await getBlueprintDirPath();
        const f = await exists(`${path}/${props.collection.key}/${BLUE_PRINT_FILENAME}`);
        setFileExist(f);
    }, [props.collection.key]);

    useEffect(() => {
        checkForLocalFile();
    }, [checkForLocalFile])

    const onDownload = async () => {
        downloadBtnRef.current?.showLoader(true);
        const fromUrl = await storage().ref(SFS_GAMING_BPS).child(props.collection.key).child(BLUE_PRINT_FILENAME).getDownloadURL();
        const dirPath = await getBlueprintDirPath();

        if (!await exists(dirPath)) return dispatch(setToast({
            text: "No Game file found",
            title: "Error",
            type: ToastTypes.error,
        }))

        const path = [dirPath, props.collection.key];

        for (let i = 0; i < path.length; i++) {
            const p = path.slice(0, i + 1).join('/');
            if (!(await exists(p))) {
                await mkdir(p);
            }
        }

        const downloadOptions: DownloadFileOptions = {
            fromUrl,
            toFile: [...path, BLUE_PRINT_FILENAME].join('/'),
        }
        const { promise } = downloadFile(downloadOptions);
        try {
            console.log(await promise);
        } catch (e: any) {
            dispatch(setToast({
                text: e.message || "Unable to download",
                type: ToastTypes.error,
                title: "Error downloading",
            }));
        }
        downloadBtnRef.current?.showLoader(false);
        checkForLocalFile();
    }

    return (
        <View style={[styles.listContainer, props.style]}>
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
                <Button onPress={onWatch}>WATCH VIDEO</Button>
                {
                    fileExist ? (
                        <Button onPress={onOpen}>OPEN</Button>
                    ) : (
                        <Button ref={downloadBtnRef} onPress={onDownload}>DOWNLOAD</Button>
                    )
                }
            </View>
        </View>
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
            justifyContent: 'center',
        },
        metaContentContainer: {
            flex: 0.7,
        },
        titleText: {
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.fontSize.h3,
            color: theme.color.spider,
        },
    }), [theme])
}

export default GamingVideoList;
