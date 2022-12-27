import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import Header from '../components/Header';
import GamingVideoList from '../components/GamingVideoList';
import Tab from '../components/Tab';
import YoutubeVideoList from '../components/YoutubeVideoList';

const GamingList = () => {
    const styles = useStyles();

    const tabData: {[key in string]: React.ReactNode} = useMemo(() => {
        return {
            "folder": <GamingVideoList />,
            "video-collection": <YoutubeVideoList />,
        }
    }, [])

    return (
        <View style={styles.container}>
            <Header title='SFS Gaming' showBack={false} />
            <Tab data={tabData} iconKey={true} />
        </View>
    )
}

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background.color,
        },
    }), [theme])
}

export default GamingList;
