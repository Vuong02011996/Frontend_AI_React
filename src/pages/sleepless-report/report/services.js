import { Helper, variables } from '@/utils';
import request from '@/utils/request';
import { isArray } from 'lodash';
import requestNormalizer from '@/utils/requestNormalizer';

export function getAll(params = {}) {
    return request('/sleepless/get_all_data', {
        prefix: API_URL_AI,
        method: 'GET',
        params: {
            ...params,
            user_id: isArray(params?.user_id) ? params?.user_id?.join(',') : params?.user_id,
            date: Helper.getDateTime({
                value: Helper.setDate({
                    ...variables.setDateData,
                    originValue: params.date,
                }),
                format: variables.DATE_FORMAT.DATE_AFTER,
                isUTC: false,
            }),
        },
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

export function getStudents(params) {
    return request('/students', {
        prefix: API_URL,
        method: 'GET',
        params: {
            ...params,
            ...Helper.getPagination(variables.PAGINATION.PAGE, variables.PAGINATION.SIZEMAX),
            classStatus: params.class ? 'HAS_CLASS' : 'ALL',
        },
    });
}
