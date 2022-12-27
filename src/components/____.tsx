import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/types';

type propTypes = {

}

const Comp = React.memo<propTypes>((props) => {
    const styles = useStyles();

    return (
        <View style={styles.container}>

        </View>
    )
})

const useStyles = () => {
    const theme = useSelector((store: RootState) => store.theme);

    return useMemo(() => StyleSheet.create({
        container: {
            flex:1,
        },
    }), [theme])
}

export default Comp;
