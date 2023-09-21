import { getMenuLeft } from '@/services/menu';

export default {
  namespace: 'menu',
  state: {
    menuLeftData: [],
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
  },
  effects: {
    *GET_DATA(action, { put, call }) {
      const menuLeftData = yield call(getMenuLeft);
      yield put({
        type: 'SET_STATE',
        payload: {
          menuLeftData,
        },
      });
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'GET_DATA',
      });
    },
  },
};
