import request from '@/utils/request';

export function get(params = {}) {
  return request('/v1/product-groups', {
    method: 'GET',
    params: {
      ...params,
      orderBy: 'id',
      sortedBy: 'desc',
    },
  });
}
