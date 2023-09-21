import * as services from './services';

export default {
  namespace: 'cameraAdd',
  state: {
    details: {},
    error: {
      isError: false,
      data: {},
    },
    branches: [],
    classes: [],
    rollCall: {
      coordinates: [],
      from_time: null,
      to_time: null,
    },
    safeAreaRegions: [],
    sleepless: [],
    statusJobs: [],
  },
  reducers: {
    INIT_STATE: (state) => ({ ...state, isError: false, data: [] }),
    SET_DATA: (state, { payload }) => ({
      ...state,
      details: payload,
      rollCall: payload?.jobs_cam?.roll_call || state.rollCall,
      safeAreaRegions: payload?.jobs_cam?.safe_area_regions || state.safeAreaRegions,
      sleepless: payload?.jobs_cam?.sleepless || state.sleepless,
    }),
    SET_BRANCHES: (state, { payload }) => ({
      ...state,
      branches: payload.parsePayload,
    }),
    SET_CLASSES: (state, { payload }) => ({
      ...state,
      classes: payload.items,
    }),
    SET_UPDATE_SEEPLESS: (state, { payload }) => ({
      ...state,
      sleepless: payload,
    }),
    SET_UPDATE_ROOL_CALL: (state, { payload }) => ({
      ...state,
      rollCall: payload,
    }),
    SET_UPDATE_SAFE_AREA_REGIONS: (state, { payload }) => ({
      ...state,
      safeAreaRegions: payload,
    }),
    SET_STATUS_JOBS: (state, { payload }) => ({
      ...state,
      statusJobs: payload.jobs_status,
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
    *UPDATE_SEEPLESS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'SET_UPDATE_SEEPLESS',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_SAFE_AREA_REGIONS({ payload }, saga) {
      try {
        yield saga.put({
          type: 'SET_UPDATE_SAFE_AREA_REGIONS',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *UPDATE_ROOL_CALL({ payload }, saga) {
      try {
        yield saga.put({
          type: 'SET_UPDATE_ROOL_CALL',
          payload,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *GET_DATA({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.get, payload);
        yield saga.put({
          type: 'SET_DATA',
          payload: response,
        });
        callback(response);
      } catch (error) {
        callback(null, error);
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
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
    *CONNECT({ payload, callback }, saga) {
      try {
        const response = yield saga.call(services.connect, payload);
        callback(response);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *ADD({ payload, callback }, saga) {
      try {
        yield saga.call(services.add, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *UPDATE({ payload, callback }, saga) {
      try {
        yield saga.call(services.update, payload);
        callback(payload);
      } catch (error) {
        callback(null, error?.data?.error);
      }
    },
    *REMOVE({ payload, callback }, saga) {
      try {
        yield saga.call(services.remove, payload.id);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *START_ROLLCALL({ payload, callback }, saga) {
      try {
        yield saga.call(services.startRollCall, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *STOP_ROLLCALL({ payload, callback }, saga) {
      try {
        yield saga.call(services.stopRollCall, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_ROLLCALL({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateRollCall, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *START_SAFE_REGIONS({ payload, callback }, saga) {
      try {
        yield saga.call(services.startSafeRegions, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *STOP_SAFE_REGIONS({ payload, callback }, saga) {
      try {
        yield saga.call(services.stopSafeRegions, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_SAFE_REGIONS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateSafeRegions, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *START_BEHAVIORS({ payload, callback }, saga) {
      try {
        yield saga.call(services.startBehaviors, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *STOP_BEHAVIORS({ payload, callback }, saga) {
      try {
        yield saga.call(services.stopBehaviors, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_BEHAVIORS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateBehaviors, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *GET_STATUS_JOBS({ payload }, saga) {
      try {
        const response = yield saga.call(services.statusJobs, payload);
        yield saga.put({
          type: 'SET_STATUS_JOBS',
          payload: response,
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
          payload: error.data,
        });
      }
    },
    *START_SLEEPLESS({ payload, callback }, saga) {
      try {
        yield saga.call(services.startSleepless, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *STOP_SLEEPLESS({ payload, callback }, saga) {
      try {
        yield saga.call(services.stopSleepless, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
    *UPDATE_ACTION_SLEEPLESS({ payload, callback }, saga) {
      try {
        yield saga.call(services.updateSleepless, payload);
        callback(payload);
      } catch (error) {
        callback(null, error);
      }
    },
  },
};
