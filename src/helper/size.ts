import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const getDeviceWidth = () => width;
export const getDeviceHeight = () => height;
