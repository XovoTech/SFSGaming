import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { StyleSheet, View, FlatList, ListRenderItem, RefreshControl, ActivityIndicator, Text, StyleProp, ViewStyle, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Input from './Input';
import { SFS_GAMING_BPS } from '../constants/value';
import { RootState } from '../store/types';
import SkeletonSearch from './skeletons/SkeletonSearch';
import storage from '@react-native-firebase/storage';
import { IconTypes } from '../constants/enums';
import Icon from './Icon';
import { navigate } from '../helper/navigator';

type propTypes = {
    style?: StyleProp<any>,
}

const EditBlueprintList = React.memo<propTypes>((props) => {
    const styles = useStyles();
    const [searchInput, setSearchText] = useState<string>("");
    const theme = useSelector((store: RootState) => store.theme);

    const { data, isLoading } = useQuery({
        queryKey: [SFS_GAMING_BPS], queryFn: async () => {
            return (await storage().ref(SFS_GAMING_BPS).listAll()).prefixes.map(v => v.fullPath)
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
            <EditBlueprintItem path={item} />
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
                data={data || []}
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
    path: string
}

const EditBlueprintItem = React.memo<listPropTypes>(({path, style}) => {
    const styles = useStyles();
    const theme = useSelector((store: RootState) => store.theme);

    const { data, isLoading } = useQuery({
        queryKey:[ path ], queryFn: async () => {
            const [blueprintLocation, simulatorImage, versionLocation] = (await storage().ref().child(path).listAll()).items;

            return {
                blueprintLocation,
                simulatorImage,
                versionLocation,
            }
        },
    });

    const onEditBlueprint = async () => {
        navigate("Edit", { path });
    }

    if (isLoading) {
        return (
            <View style={[styles.container, style]}>
                <ActivityIndicator size="small" color={theme.color.primary} />
            </View>
        )
    }

    return (
        <TouchableOpacity activeOpacity={0.6} onPress={onEditBlueprint} style={[styles.listContainer, style]}>
            <Icon name="file-text" type={IconTypes.Feather} style={styles.fileIcon} />
            <Text style={styles.blueprintText}>{data?.blueprintLocation?.toString() || ""}</Text>
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
