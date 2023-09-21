import request from '@/utils/request';
import { Helper, variables } from '@/utils';
import requestNormalizer from '@/utils/requestNormalizer';

export function get(params = {}) {
  return request('/cameras/get_all_info_cam', {
    prefix: API_URL_AI,
    method: 'GET',
    params,
  });
}

export function remove(id) {
  return request(`/cameras/cam_id/${id}`, {
    prefix: API_URL_AI,
    method: 'DELETE',
    parse: true,
  });
}

export function getBranches(params) {
  return requestNormalizer('/v1/branches', {
    prefix: API_URL_LAVAREL_CLOVER,
    method: 'GET',
    params,
    isNormalizer: true,
  });
}

export function getClass(params) {
  return request('/classes', {
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
    },
  });
}
