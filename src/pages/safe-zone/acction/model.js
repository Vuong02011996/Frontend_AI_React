import * as services from './services';

export default {
  namespace: 'manageSafeZoneAcction',
  state: {
    details: {},
    students: [],
    error: {
      isError: false,
      data: {},
    },
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload.data,
    }),
    SET_STUDENTS: (state, { payload }) => ({
      ...state,
      students: payload,
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
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
        callback(response.data);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error?.data,
        });
      }
    },
    *GET_STUDENTS({ payload }, saga) {
      try {
        const response = yield saga.call(services.getStudents, payload);
        yield saga.put({
          type: 'SET_STUDENTS',
          payload: response.items,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error?.data,
        });
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error?.data,
        });
      }
    },
  },
};
