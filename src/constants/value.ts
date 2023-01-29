import { Platform } from "react-native";
import RNFS from 'react-native-fs'

export const AUTH_USER_KEY = 'auth.user';
export const DATE_FORMAT = "ddd, MMM Do YYYY";
export const NO_IMAGE = require('../assets/no-image.jpg');
export const APP_LOGO = require('../assets/logo.png');
export const BPS_KEY = "bps";
export const SFS_GAMING_BPS = "sfsgbps";
export const SFS_PLANET_LIST = "sfsplanets";
export const BLUE_PRINT_FILENAME = "Blueprint.txt";
export const TUTORIAL_LINK = "https://www.youtube.com/watch?v=LleurpMxLzA";
export const TUTORIAL_THUMBNAIL = "https://img.youtube.com/vi/LleurpMxLzA/0.jpg";
export const LOCAL_BLUEPRINT_PATH = Platform.OS == 'android' ? `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.StefMorojna.SpaceflightSimulator/files/saving/blueprints` : '/Spaceflight simulator/saving/blueprints';
export const LOCAL_PLANET_PATH = Platform.OS == 'android' ? `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.StefMorojna.SpaceflightSimulator/files/Custom Translations` : '/Spaceflight simulator/Custom Translations';
