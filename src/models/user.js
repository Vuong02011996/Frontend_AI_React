import * as services from '@/services/login';
import { history } from 'umi';
import { notification } from 'antd';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    authorized: false,
    user: {},
    permissions: [],
  },
  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(services.login, payload);
        const me = yield call(services.me, {
          access_token: response.access_token,
          token_type: response.token_type,
        });
        yield put({
          type: 'SET_USER',
          payload: {
            ...me,
            authorized: true,
            permissions: ['ADMIN'],
          },
        });
        cookies.set('access_token', response.access_token, { path: '/' });
        cookies.set('token_type', response.token_type, { path: '/' });
      } catch (error) {
        notification.error({
          message: 'THÔNG BÁO',
          description: 'Đăng nhập không thành công. Bạn vui lòng kiểm tra lại thông tin đã nhập.',
        });
        yield put({
          type: 'SET_ERROR',
        });
      }
    },
    *VERIFY_TOKEN({ payload }, saga) {
      try {
        cookies.set('access_token', payload.access_token, { path: '/' });
        cookies.set('token_type', payload.token_type, { path: '/' });
        const response = yield saga.call(services.me, {
          access_token: payload.access_token,
          token_type: payload.token_type,
        });
        yield saga.put({
          type: 'SET_USER',
          payload: {
            ...response,
            authorized: true,
            permissions: ['ADMIN'],
          },
        });
      } catch (error) {
        history.push('/login');
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *LOAD_CURRENT_ACCOUNT({ payload }, saga) {
      try {
        const response = yield saga.call(services.me, {
          access_token: payload.access_token,
          token_type: payload.token_type,
        });
        yield saga.put({
          type: 'SET_USER',
          payload: {
            ...response,
            authorized: true,
            permissions: ['ADMIN'],
          },
        });
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
    *LOGOUT(_, saga) {
      try {
        cookies.remove('access_token', { path: '/' });
        cookies.remove('token_type', { path: '/' });
        yield saga.put({
          type: 'SET_LOGOUT',
        });
        history.push('/login');
      } catch (error) {
        yield saga.put({
          type: 'SET_ERROR',
        });
      }
    },
  },
  reducers: {
    SET_USER: (state, { payload }) => ({
      ...state,
      user: {
        ...payload,
      },
      authorized: true,
      permissions: payload.permissions,
    }),
    SET_LOGOUT: (state) => ({
      ...state,
      user: {},
      authorized: false,
      permissions: [],
    }),
  },
  subscriptions: {
    setup: ({ dispatch }) => {
      dispatch({
        type: 'LOAD_CURRENT_ACCOUNT',
        payload: {
          access_token: cookies.get('access_token'),
          token_type: cookies.get('token_type'),
        },
      });
    },
  },
};
export default UserModel;
