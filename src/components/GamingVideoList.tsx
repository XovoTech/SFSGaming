import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ListRenderItem, RefreshControl, ActivityIndicator, Text, StyleProp, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import Input from './Input';
import { SFS_GAMING_BPS } from '../constants/value';
import { RootState } from '../store/types';
import database from '@react-native-firebase/database';
import { IGamingBPS } from '../model/bps';
import SkeletonSearch from './skeletons/SkeletonSearch';
import storage from '@react-native-firebase/storage';
import Button from './Button';
import Image from './Image';


type propTypes = {
    style?: StyleProp<any>,
}

const GamingVideoList = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const [searchInput, setSearchText] = useState<string>("");
    const theme = useSelector((store: RootState) => store.theme);

    const [data, setData] = useState<{[key in string]: IGamingBPS}>({});
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
                    <Text style={styles.noResultText}>{searchInput ? `No video found for "${searchInput}"` :  "No Video found!"}</Text>
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
    const { data: image_uri, isLoading } = useQuery({
        queryKey: [SFS_GAMING_BPS, props.collection.key, props.collection.image], queryFn: async () => {
            return await storage().ref(SFS_GAMING_BPS).child(props.collection.key).child(props.collection.image).getDownloadURL();
        },
    })

    const onOpen = () => {

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
                <Button onPress={onOpen}>WATCH VIDEO</Button>
                <Button onPress={onOpen}>DOWNLOAD</Button>
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
            justifyContent:'center',
            alignItems:'center',
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
