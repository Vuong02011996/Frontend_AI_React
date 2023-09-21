import request from '@/utils/request';
import { Helper, variables } from '@/utils';
import requestNormalizer from '@/utils/requestNormalizer';

export function get(params) {
    return request('/fall_detection/get_all_data', {
        prefix: API_URL_AI_FALL_DETECTION,
        method: 'GET',
        params,
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

export function getClasses(params) {
    return request('/classes', {
        method: 'GET',
        params: {
            ...params,
            ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
        },
    });
}
