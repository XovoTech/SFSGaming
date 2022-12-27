import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// export interface IUser {
//     id: string;
//     name: string;
//     picture_url: string;
//     email: string;
// }
export interface IUser extends FirebaseAuthTypes.User {}
