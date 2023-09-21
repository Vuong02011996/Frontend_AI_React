import * as services from './services';

export default {
    namespace: 'stream',
    state: {
        url_stream_flv: 'https://ai-stream-clover.erp.clover.edu.vn',
        name_cam: null,
        position_cam: null,
        class_cam: null,
        branch_cam: null,

        error: {
            isError: false,
            data: {},
        },
    },
    reducers: {
        INIT_STATE: (state) => ({ ...state, isError: false }),
        SET_DATA: (state, { payload }) => ({
            ...state,
            url_stream_flv: payload.url_stream_flv,
            name_cam: payload.name_cam,
            position_cam: payload.position_cam,
            class_cam: payload.class_cam,
            branch_cam: payload.branch_cam,
        }),
        SET_ERROR: (state, { payload }) => ({
            ...state,
            error: {
                isError: true,
                data: {
                    ...payload,
                },
            },
        }),
    },
    effects: {
        *GET_DATA({ payload }, saga) {
            try {
                const response = yield saga.call(services.get, payload);
                console.log('response GET_DATA model stream: ', response);
                yield saga.put({
                    type: 'SET_DATA',
                    payload: response,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },
        *GET_DATA_SHOW_STREAM({ payload, callback }, saga) {
            try {
                const response = yield saga.call(services.get_show_region, payload);
                callback(response);
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },
    },
};
