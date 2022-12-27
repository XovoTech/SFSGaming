import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, View, StyleProp, Text, TouchableOpacity, Linking } from 'react-native';
import Config from 'react-native-config';
import { useDispatch, useSelector } from 'react-redux';
import { getDeviceWidth } from '../helper/size';
import { dispatchAPI, IApiParam } from '../helper/api';
import { IYoutubeVideo } from '../model/bps';
import { AppThunkDispatch, RootState } from '../store/types';
import Image from './Image';
import SkeletonSearch from './skeletons/SkeletonSearch';
// import YouTubeJSON from './youtube.json';

const YoutubeVideoList = () => {

    const dispatch = useDispatch<AppThunkDispatch>();
    const theme = useSelector((store: RootState) => store.theme);

    const { data, isLoading } = useQuery<Array<any>>({
        queryKey: [Config.YOUTUBE_API_KEY], queryFn: async () => {
            const params: IApiParam = {
                method: "GET",
                params: {
                    part: 'snippet',
                    channelId: "UC8UO3XM8h66Prpp6A9dqiCw",
                    order: "date",
                    maxResults: 50,
                    key: Config.YOUTUBE_API_KEY,
                },
                path: "https://youtube.googleapis.com/youtube/v3/search",
            }
            const response = await dispatch(dispatchAPI(params));
            return response.items;
            // return YouTubeJSON;
        },
    })

    const styles = useStyles();

    const renderItem: ListRenderItem<IYoutubeVideo> = ({ item }) => {
        return (
            <YoutubeVideoListItem youtubeVideo={item} key={item.etag} />
        )
    }

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
                    <Text style={styles.noResultText}>Unable to load Youtube Video!</Text>
                </View>
            )

    }, [styles, isLoading]);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                style={styles.flatList}
                keyExtractor={(item: IYoutubeVideo) => `${item.id.videoId}`}
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
}

type listPropTypes = {
    youtubeVideo: IYoutubeVideo,
    style?: StyleProp<any>,
}

const YoutubeVideoListItem = React.memo<listPropTypes>((props) => {
    const styles = useStyles();
    const { snippet } = props.youtubeVideo;
    const { medium } = snippet?.thumbnails || {};

    const onPress = () => Linking.openURL(`http://www.youtube.com/watch?v=${props.youtubeVideo?.id?.videoId}`)

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={onPress} style={[styles.listContainer, props.style]}>
            <Image style={styles.listImage} source={{ uri: medium?.url }} />
            <Text style={styles.titleText}>{snippet?.title}</Text>
        </TouchableOpacity>
    )
})

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
        },
        flatList: {
            marginVertical: theme.spacingFactor,
        },
        listContainer: {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            margin: theme.spacingFactor,
            backgroundColor: theme.color.grayBackground2,
            borderRadius: theme.spacingFactor / 2,
        },
        listImage: {
            width: getDeviceWidth() * 0.95,
        },
        titleText: {
            color: theme.color.spider,
            fontSize: theme.fontSize.h4,
            fontFamily: theme.fontFamily.bold,
            marginVertical: theme.spacingFactor,
            paddingHorizontal: theme.spacingFactor,
            width: "100%",
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
    }), [theme])
}

export default YoutubeVideoList;
