import React, { useCallback, useEffect, useState, useMemo, useImperativeHandle } from 'react';
import FastImage, { Source, ResizeMode, OnLoadEvent } from 'react-native-fast-image';
import { Image as RNImage, StyleSheet, NativeSyntheticEvent, ImageErrorEventData, ImageResizeMode, ImageLoadEventData, StyleProp } from 'react-native';

type propTypes = {
    source: number | Source,
    onError?: (error?: NativeSyntheticEvent<ImageErrorEventData>) => void,
    resizeMode?: ImageResizeMode & ResizeMode,
    onLoadStart?: () => void,
    onLoadEnd?: () => void,
    onLoad?: (event?: OnLoadEvent | NativeSyntheticEvent<ImageLoadEventData>) => void,
    style?: StyleProp<any>,
}

export interface IImageRef {
    width?: number;
    height?: number;
    getSize?: (uri: string) => Promise<number[]>;
}

const Image = React.forwardRef<IImageRef, propTypes>((props, ref) => {
    const { source, onError, resizeMode, onLoadStart, onLoadEnd, onLoad, style, ...imageProps } = props;
    const [currentSource, setSource] = useState(source);
    const [, setLoading] = useState(false);
    const [imageDimension, setImageDimension] = useState({ width: 1, height: 1 });

    const styles = useStyles();

    const getSize = (uri: string) => new Promise<number[]>((resolve, reject) => {
        RNImage.getSize(uri, (w, h) => resolve([w,h]), reject)
      });

    useEffect(() => {
        setSource(source);
        if (typeof source != 'number' && source.uri) {
            getSize(source.uri).then(([width, height]) => {
                setImageDimension({width, height})
            }).catch((e) => console.log("onImageSize",e, source.uri))
        }
    }, [source]);

    useImperativeHandle(ref, () => {
        return {
            width: imageDimension.width,
            height: imageDimension.height,
            getSize,
        }
    }, [imageDimension])

    const onLoaded = useCallback((e?: OnLoadEvent | NativeSyntheticEvent<ImageLoadEventData>) => {
        if (onLoad) onLoad(e)
    }, [onLoad])

    const onLoadError = useCallback((e?: NativeSyntheticEvent<ImageErrorEventData>) => {
        // setSource(NO_IMAGE);
        if (onError) onError(e);
    }, [onError]);

    const onLoadBegin = useCallback(() => {
        setLoading(true);
        if (onLoadStart) onLoadStart();
    }, [onLoadStart]);

    const onLoadFinish = useCallback(() => {
        setLoading(false);
        if (onLoadEnd) onLoadEnd();
    }, [onLoadEnd]);

    const height = useMemo(() => {
        if (style?.height) return style.height;

        if (style?.width && imageDimension.width) {
            const ratio = parseFloat(`${(style?.width / imageDimension.width)}`) || 0;
            return imageDimension.height * ratio;
        }

        if (style?.width) return style.width;

        return "100%"

    }, [imageDimension, style])

    if (typeof currentSource == "number") {
        return (
            <RNImage
                source={currentSource}
                onLoadStart={onLoadBegin}
                onLoadEnd={onLoadFinish}
                onLoad={onLoaded}
                onError={onLoadError}
                style={style}
                resizeMode={resizeMode || (imageDimension.width >= imageDimension.height ? 'contain' : 'cover')}
                {...imageProps} />
        )
    }

    return (
        <FastImage
            source={currentSource}
            onLoadStart={onLoadBegin}
            onLoadEnd={onLoadFinish}
            onError={onLoadError}
            onLoad={onLoaded}
            resizeMode={resizeMode || (imageDimension.width >= imageDimension.height ? 'contain' : 'cover')}
            {...imageProps}
            style={[style,{ width: style?.width || styles.image.width, height}]}
            // style={[styles.image, { width: style.width, height: style.height || (ratio * imageDimension.height)}]}
        />
    )
});

const useStyles = () => {
    // const theme = useSelector(store => store.theme);
    return useMemo(() => StyleSheet.create({
        image: {
            width: "100%",
            height: "100%",
        },
    }), [])
}

export default Image;
