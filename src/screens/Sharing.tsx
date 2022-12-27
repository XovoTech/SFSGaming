import React, { useMemo, useState, useEffect } from 'react';
import { View, FlatList, ListRenderItem, Text, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import CollectionItem from '../components/CollectionItem';
import Header from '../components/Header';
import SkeletonSearch from '../components/skeletons/SkeletonSearch';
import { RootState } from '../store/types';
import database from '@react-native-firebase/database';
import { BPS_KEY } from '../constants/value';
import Input from '../components/Input';
import { IBPSInfo } from '../model/bps';

const SharingScreen = () => {
    const styles = useStyles();
    const theme = useSelector((store: RootState) => store.theme);
    const [searchInput, setSearchText] = useState<string>("");
    const [data, setData] = useState<{[key in string]: IBPSInfo}>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        database().ref(BPS_KEY).on('value', (snapshot) => {
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
                    <Text>No Posts found!</Text>
                </View>
            )
    }, [styles, isLoading]);

    const renderItem: ListRenderItem<IBPSInfo> = ({ item }) => {
        return (
            <CollectionItem collection={item} key={item.key} />
        )
    }

    const filterItem = (item: IBPSInfo) => {
        if (!searchInput) return true
        return item.name.toLowerCase().includes(searchInput.toLowerCase())
    }

    return (
        <View style={styles.container}>
            <Header title='Sharing' showBack={false} />
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
                keyExtractor={(item: IBPSInfo) => `${item.key}`}
                initialNumToRender={8}
                removeClippedSubviews={true}
                maxToRenderPerBatch={100}
                windowSize={7}
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
    );
}

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);
    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.color,
        },
        input: {
            margin: theme.spacingFactor * 1.5,
        },
        flatList: {
            marginTop: theme.spacingFactor,
        },
        noResultWrapper: {

        },
    }), [theme])
};

export default SharingScreen;
