import { SET_DARK_THEME } from "../constant/theme";
import darkTheme from "../../constants/darkTheme";

export type IThemeReducer =  typeof darkTheme;

const initialState = darkTheme;

export default (state = initialState, action: any) => {
    switch (action.type) {
        case SET_DARK_THEME:
            return darkTheme
        default:
            return state;
    }
}
