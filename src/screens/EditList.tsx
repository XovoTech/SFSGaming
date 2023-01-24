import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';
import Header from '../components/Header';
import Tab from '../components/Tab';
import EditBlueprintList from '../components/EditBlueprintList';
import PlanetExplorer from '../components/PlanetExplorer';
import { IconTypes } from '../constants/enums';

const EditList = () => {
    const styles = useStyles();

    const tabData: {[key in string]: React.ReactNode} = useMemo(() => {
        return {
            "rocket": <EditBlueprintList />,
            "planet": <PlanetExplorer />,
        }
    }, [])

    return (
        <View style={styles.container}>
            <Header title='SFS Gaming' showBack={false} />
            <Tab data={tabData} iconKey={true} iconType={[IconTypes.MaterialCommunityIcons, IconTypes.Ionicons]}/>
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

    }), [theme])
}


export default EditList;
