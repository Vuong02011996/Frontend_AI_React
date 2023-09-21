import request from '@/utils/request';
import { Helper } from '@/utils';

export function get(params = {}) {
  return request(`/v1/contents`, {
    method: 'GET',
    params: {
      ...params,
      include: Helper.convertIncludes([
        'slider',
        'banner',
        'contentThree.contentThreeDetail',
        'socialNetwork',
        'contentTwo',
      ]),
    },
  });
}
