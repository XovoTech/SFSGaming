import ContentLoader, { Circle, Rect } from 'react-content-loader/native';

import React from 'react';
import {  useSelector } from 'react-redux';
import { RootState } from '../../store/types';

type propTypes = {
    stretch?: boolean,
}

const Loader = ContentLoader as any;

const SkeletonSearch = React.memo<propTypes>((props) => {
    const theme = useSelector((store: RootState) => store.theme);
    if (props.stretch) {
        return (
            <Loader animate height={80} viewBox="0 0 500 70"  backgroundColor={theme.color.grayBackground3} foregroundColor={theme.color.grayBackground2}>
                <Circle x="45" y="35" r="35" />
                <Rect x="95" y="15" rx="4" ry="4" width="300" height="8" />
                <Rect x="90" y="40" rx="4" ry="4" width="360" height="8" />
            </Loader>
        )
    }

    return (
        <Loader animate height={60} viewBox="0 0 400 70"  backgroundColor={theme.color.grayBackground3} foregroundColor={theme.color.grayBackground2}>
            <Circle x="40" y="30" r="30" />
            <Rect x="95" y="15" rx="4" ry="4" width="240" height="8" />
            <Rect x="90" y="40" rx="4" ry="4" width="260" height="8" />
        </Loader>
    )
});

export default SkeletonSearch;
