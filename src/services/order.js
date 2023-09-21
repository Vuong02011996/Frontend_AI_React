import request from '@/utils/request';
import { Helper } from '@/utils';

export function getOrders(params = {}) {
  return request(`/v1/orders`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([]),
    },
  });
}
