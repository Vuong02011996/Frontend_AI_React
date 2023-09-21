import * as services from './services';

export default {
    namespace: 'safeRegionConfig',
    state: {
        coordinates: [],
        from_time: null,
        to_time: null,
        status_process: 'NOT_RUN',
        process_name: null,
        frame_url: null,
        duration_time: 0,
        error: {
            isError: false,
            data: {},
        },
    },
    reducers: {
        INIT_STATE: (state) => ({ ...state, isError: false }),
        SET_DATA: (state, { payload }) => ({
            ...state,
            coordinates: payload?.coordinates || [],
            from_time: payload?.from_time || null,
            to_time: payload?.to_time || null,
            frame_url: payload?.frame_url || null,
            status_process: payload?.status_process || 'NOT_RUN',
            process_name: payload?.process_name || null,
            duration_time: payload?.duration_time || 0,
        }),
        SET_UPDATE_CONFIG_TIME: (state, { payload }) => ({
            ...state,
            ...payload,
        }),
        SET_UPDATE_CONFIG_COORDINARITE: (state, { payload }) => ({
            ...state,
            coordinates: payload.coordinates,
        }),

        SET_UPDATE_STATUS: (state, { payload }) => ({
            ...state,
            status_process: payload.status_process,
            process_name: payload.process_name,
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
        *GET_CURRENT_CONFIG({ payload }, saga) {
            try {
                const response = yield saga.call(services.getCurrentConfig, payload);
                console.log('response GET_CURRENT_CONFIG safeRegionConfig: ', response);
                yield saga.put({
                    type: 'SET_DATA',
                    payload: response.data,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },
        *UPDATE_CONFIG_TO_DB({ payload, callback }, saga) {
            try {
                yield saga.call(services.update, payload);
                callback(payload);
            } catch (error) {
                callback(null, error);
            }
        },
        // Using when thay đổi thời gian bắt đầu và kết thúc điểm danh sẽ update lại store , không liên quan đến gửi API
        *UPDATE_CONFIG_TIME({ payload }, saga) {
            try {
                yield saga.put({
                    type: 'SET_UPDATE_CONFIG_TIME',
                    payload,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },
        *UPDATE_CONFIG_COORDINARITE({ payload }, saga) {
            console.log('payload UPDATE_CONFIG_COORDINARITE: ', payload);
            try {
                yield saga.put({
                    type: 'SET_UPDATE_CONFIG_COORDINARITE',
                    payload,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },

        *START({ payload, callback }, saga) {
            try {
                const response = yield saga.call(services.start, payload);
                console.log('response START_ROLLCALL: ', response);
                callback(response);
                try {
                    yield saga.put({
                        type: 'SET_UPDATE_STATUS',
                        payload: response,
                    });
                } catch (error) {
                    yield saga.put({
                        type: 'SET_ERROR',
                        payload: error.data,
                    });
                }
            } catch (error) {
                callback(null, error);
            }
        },
        *STOP({ payload, callback }, saga) {
            try {
                const response = yield saga.call(services.stop, payload);
                console.log('response STOP: ', response);
                callback(response);
                try {
                    yield saga.put({
                        type: 'SET_UPDATE_STATUS',
                        payload: response,
                    });
                } catch (error) {
                    yield saga.put({
                        type: 'SET_ERROR',
                        payload: error.data,
                    });
                }
            } catch (error) {
                callback(null, error);
            }
        },
    },
};
