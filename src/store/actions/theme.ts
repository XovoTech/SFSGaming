import { SET_DARK_THEME, SET_LIGHT_THEME, SET_DIM_THEME } from '../constant/theme';

export const setTheme = (theme = "light") => {
    switch (theme) {
        case 'dark':
            return {
                type: SET_DARK_THEME,
            }
        case 'dim':
            return {
                type: SET_DIM_THEME,
            }
        default:
            return {
                type: SET_LIGHT_THEME,
            }
    }
};
