import { upload } from '@/services/upload';

export default {
    namespace: 'upload',
    state: {},
    effects: {
        *UPLOAD({ payload, callback }, { call }) {
            try {
                const response = yield call(upload, payload);
                // console.log('response upload: ', response);
                if (response) callback(response);
            } catch (err) {
                callback(null, err);
            }
        },
    },
};
