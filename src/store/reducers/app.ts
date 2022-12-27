import { IRouteInstance, IToast } from '../../model/app';
import { SHOW_TOAST, SET_NOTIFICATION_TOAST } from '../constant/app';

export interface IAppReducer {
    toast?: IToast | null;
    drawer: boolean;
    activeRoute: IRouteInstance | null;
}

const initialState: IAppReducer = {
    drawer: false,
    activeRoute: null,
};

export default (state = initialState, action: any) => {
    switch (action.type) {
        case SHOW_TOAST:
            return {
                ...state,
                toast: action.toast,
            }
        case SET_NOTIFICATION_TOAST:
            return {
                ...state,
                notification: action.notification,
            }
        default:
            return state;
    }
};
