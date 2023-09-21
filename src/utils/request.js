import { get, pickBy, omit } from 'lodash';
import { notification } from 'antd';
import { extend } from 'umi-request';
import Cookies from 'universal-cookie';
import { variables } from './variables';

const cookies = new Cookies();

const request = extend({
  prefix: API_URL,
  maxCache: 10,
});

const removeParams = (params) =>
  omit(pickBy(params, (value) => value !== null && value !== undefined));
let optionsRoot;

// request options
request.interceptors.request.use(async (url, options) => {
  optionsRoot = options;
  const access_token = cookies.get('access_token');
  const token_type = cookies.get('token_type');
  if (access_token && token_type) {
    return {
      options: {
        ...options,
        params: removeParams(options.params),
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
        interceptors: true,
      },
    };
  }
  return {
    options: {
      ...options,
      interceptors: true,
    },
  };
});

// response interceptor, handling response
request.interceptors.response.use(
  async (response) => {
    if (response.status === variables.STATUS_204) {
      return {
        ...response,
        status: response.status,
      };
    }
    if (
      optionsRoot?.isNotification &&
      optionsRoot?.parse &&
      response.status >= 200 &&
      response.status <= 300
    ) {
      notification.success({
        message: 'Thông báo',
        description: 'Bạn đã cập nhật thành công dữ liệu',
      });
      return {
        status: 201,
      };
    }
    const dataRoot = await response.clone().json();
    if (variables.method.includes(optionsRoot?.method?.toLowerCase())) {
      if (response.status >= 400 && response.status <= 500) {
        notification.error({
          message: 'Thông báo',
          description:
            get(dataRoot, 'error.validationErrors[0].message') ||
            get(dataRoot, 'error.message') ||
            get(dataRoot, 'data') ||
            'Lỗi hệ thống vui lòng kiểm tra lại',
        });
      }
      if (response.status >= 200 && response.status <= 300 && optionsRoot?.isNotification) {
        notification.success({
          message: 'Thông báo',
          description: 'Bạn đã cập nhật thành công dữ liệu',
        });
      }
    }

    return response;
  },
  (error) => error,
);

// middleware response and request
request.use(async (ctx, next) => {
  await next();
});

export default request;
