import request from '@/utils/request';
import { Helper, variables } from '@/utils';
import requestNormalizer from '@/utils/requestNormalizer';
import { isArray } from 'lodash';

export function get(params) {
    return request('/identities_ai/get_identities_in_DB_AI', {
        prefix: API_URL_AI,
        method: 'GET',
        params: {
            ...params,
            user_id: isArray(params?.user_id) ? params?.user_id?.join(',') : params?.user_id,
        },
    });
}

export function getStudentsFromBE() {
    return request('/identities_ai/get_all_identities_from_dot_net', {
        prefix: API_URL_AI,
        method: 'GET',
    });
}

export function addFace(data) {
    return request('/identities_ai/update_identities_in_DB_AI', {
        prefix: API_URL_AI,
        method: 'PUT',
        data,
    });
}

export function remove(data) {
    return request('/identities_ai/delete_identity_v2', {
        prefix: API_URL_AI,
        method: 'PUT',
        data,
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
