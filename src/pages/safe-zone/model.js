import * as services from './services';

export default {
  namespace: 'manageSafeZone',
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
  },
  reducers: {
    INITAL_STATE: (state) => ({ ...state, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      data: payload?.data || [],
      pagination: payload?.meta?.pagination,
    }),
    SET_BRANCHES: (state, { payload }) => ({ ...state, branches: payload.parsePayload }),
    SET_CLASSES: (state, { payload }) => ({ ...state, classes: payload.items }),
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
    *GET_BRANCHES({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.getBranches, payload);
        callback(response.parsePayload);
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
        const response = yield saga.call(services.getClasses, payload);
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
  },
};
