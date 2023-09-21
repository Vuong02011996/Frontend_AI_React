import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request('/tool-details', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(params.page, params.limit),
    },
  });
}

export function remove(id) {
  return request(`/tool-details/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}
