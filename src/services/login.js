import request from '@/utils/request';
import qs from 'qs';

export function login(data) {
  return request('/connect/token', {
    prefix: API_SSO_URL,
    method: 'POST',
    headers: {
      Authorization: 'Basic RXJwX0FwcDoxcTJ3M0Uq',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: qs.stringify({
      ...data,
    }),
    parse: true,
    isNotification: false,
  });
}

export function me(data) {
  return request('/user/me', {
    prefix: API_URL_NET,
    method: 'GET',
    headers: {
      Authorization: `${data.token_type} ${data.access_token}`,
    },
    parse: true,
    isNotification: false,
  });
}

export async function logout() {
  return request('/api/logout', {
    method: 'POST',
    parse: true,
    isLogin: true,
    cancelNoti: true,
  });
}
