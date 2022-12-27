import { dispatchAPI, IApiParam } from "../helper/api";
import { AppThunkDispatch } from "../store/types";

/********************************************************************************************************************/
export const getTimeline = (params: IApiParam = {}) => (dispatch: AppThunkDispatch) => {
    params.method = params.method || "GET";
    params.path = params.path || "timelines/home";

    return dispatch(dispatchAPI(params))
};
