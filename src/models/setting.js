import store from 'store';

const STORED_SETTINGS = (storedSettings) => {
  const settings = {};
  Object.keys(storedSettings).forEach((key) => {
    const item = store.get(`app.settings.${key}`);
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key];
  });
  return settings;
};

export default {
  namespace: 'settings',
  state: {
    ...STORED_SETTINGS({
      isMobileView: false,
      isMobileMenuOpen: false,
      isLightTheme: true,
      isSettingsOpen: false,
      isMenuTop: false,
      isMenuCollapsed: false,
      isBorderless: true,
      isSquaredBorders: false,
      isFixedWidth: false,
      isMenuShadow: true,
      isGreenTheme: false,
    }),
    background: localStorage.getItem('background') || 'images/bg.jpg',
  },
  reducers: {
    SET_STATE: (state, action) => ({ ...state, ...action.payload }),
    SET_SETTING_COLLAPSED: (state, action) => ({ ...state, ...action.payload }),
    SET_CHANGE_BACKGROUND: (state, { payload }) => ({ ...state, background: payload }),
  },
  effects: {
    *CHANGE_SETTING({ payload: { setting, value } }, { put }) {
      yield store.set(`app.settings.${setting}`, value);
      yield put({
        type: 'SET_STATE',
        payload: {
          [setting]: value,
        },
      });
    },
    *CHANGE_SETTING_COLLAPSED({ payload: { setting, value } }, { put }) {
      yield put({
        type: 'SET_SETTING_COLLAPSED',
        payload: {
          [setting]: value,
        },
      });
    },
    *CHANGE_BACKGROUND({ payload }, { put }) {
      localStorage.setItem('background', payload);
      yield put({
        type: 'SET_CHANGE_BACKGROUND',
        payload,
      });
    },
  },
  subscriptions: {
    setup: ({ dispatch, history }) => {
      // load settings from url on app load
      history.listen((params) => {
        const { query } = params;
        Object.keys(query).forEach((key) => {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: key,
              value: query[key] === 'true',
            },
          });
        });
      });

      // detect isMobileView setting on app load and window resize
      const isMobileView = (load = false) => {
        const currentState = global.window.innerWidth < 768;
        const prevState = store.get('app.settings.isMobileView');
        if (currentState !== prevState || load) {
          dispatch({
            type: 'CHANGE_SETTING',
            payload: {
              setting: 'isMobileView',
              value: currentState,
            },
          });
        }
      };
      window.addEventListener('resize', () => {
        isMobileView();
      });
      isMobileView(true);
    },
  },
};
