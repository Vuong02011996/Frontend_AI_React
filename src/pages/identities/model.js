import * as services from './services';

export default {
    namespace: 'identities',
    state: {
        data: [],
        pagination: {
            total: 0,
        },
        branches: [],
        classes: [],
        error: {
            isError: false,
            data: {},
        },
        students: [],
    },
    reducers: {
        INITAL_STATE: (state) => ({ ...state, data: [] }),
        SET_DATA: (state, { payload }) => ({
            ...state,
            data: payload?.data,
            pagination: payload?.meta?.pagination,
        }),
        SET_BRANCHES: (state, { payload }) => ({
            ...state,
            branches: payload.parsePayload,
        }),
        SET_STUDENTS: (state, { payload }) => ({
            ...state,
            students: payload?.items,
        }),
        SET_CLASSES: (state, { payload }) => ({
            ...state,
            classes: payload.items,
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
        *GET_BRANCHES({ payload }, saga) {
            try {
                const response = yield saga.call(services.getBranches, payload);
                yield saga.put({
                    type: 'SET_BRANCHES',
                    payload: response,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR_BRANCHES',
                    payload: error.data,
                });
            }
        },
        *GET_CLASSES({ payload }, saga) {
            try {
                const response = yield saga.call(services.getClass, payload);
                yield saga.put({
                    type: 'SET_CLASSES',
                    payload: response,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },
        *GET_STUDENTS({ payload }, saga) {
            try {
                const response = yield saga.call(services.getStudents, payload);
                yield saga.put({
                    type: 'SET_STUDENTS',
                    payload: response,
                });
            } catch (error) {
                yield saga.put({
                    type: 'SET_ERROR',
                    payload: error.data,
                });
            }
        },
        *GET_DATA({ payload }, saga) {
            try {
                const response = yield saga.call(services.get, payload);
                yield saga.put({
                    type: 'SET_DATA',
                    payload: response,
                });
            } catch (error) {
                saga.put({
                    type: 'SET_ERROR',
                    payload: error?.data,
                });
            }
        },
        *GET_DATA_FROM_BE({ callback }, saga) {
            try {
                const response = yield saga.call(services.getStudentsFromBE);
                callback(response);
            } catch (error) {
                saga.put({
                    type: 'SET_ERROR',
                    payload: error?.data,
                });
            }
        },

        *REMOVE({ payload, callback }, saga) {
            try {
                yield saga.call(services.remove, payload);
                callback(payload);
            } catch (error) {
                callback(null, error);
            }
        },

        *ADD_FACE({ payload, callback }, saga) {
            try {
                const response = yield saga.call(services.addFace, payload);
                callback(response);
            } catch (error) {
                callback(null, error);
            }
        },
    },
};
