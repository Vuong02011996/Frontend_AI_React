import { Helper, variables } from '@/utils';
import request from '@/utils/request';

export function get(params = {}) {
  return request(`/safe_regions/get_data_by_id/${params.user_id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function update(data = {}) {
  return request(`/safe_regions/update/${data.id}`, {
    prefix: API_URL_AI,
    method: 'PUT',
    data,
    isNotification: true,
  });
}

export function getStudents(params) {
  return request('/students', {
    prefix: API_URL,
    method: 'GET',
    params: {
      ...params,
      ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
      classStatus: params.class ? 'HAS_CLASS' : 'ALL'
    },
  });
}