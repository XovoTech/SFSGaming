import { Platform } from 'react-native';
import { LOCAL_BLUEPRINT_PATH, LOCAL_PLANET_PATH } from '../constants/value';

export const getBlueprintDirPath = async (): Promise<string> => {
    if (Platform.OS == 'android') {
        // const absolutePaths = await RNFS.getAllExternalFilesDirs();
        // const packageName = await DeviceInfo.getInstallerPackageName();
        // if (absolutePaths.length > 0) {
        //     const relativePath = absolutePaths[absolutePaths.length - 1];
        //     return `${relativePath.replace(packageName, 'com.StefMorojna.SpaceflightSimulator')}`;
        // }

        return LOCAL_BLUEPRINT_PATH;
    }
    return LOCAL_BLUEPRINT_PATH;
}

export const getPlanetDirPath = async (): Promise<string> => {
    if (Platform.OS == 'android') {
        // const absolutePaths = await RNFS.getAllExternalFilesDirs();
        // const packageName = await DeviceInfo.getInstallerPackageName();
        // if (absolutePaths.length > 0) {
        //     const relativePath = absolutePaths[absolutePaths.length - 1];
        //     return `${relativePath.replace(packageName, 'com.StefMorojna.SpaceflightSimulator')}`;
        // }

        return LOCAL_PLANET_PATH;
    }
    return LOCAL_PLANET_PATH;
}
