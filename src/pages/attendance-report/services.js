import { Helper, variables } from '@/utils';
import request from '@/utils/request';
import { isArray } from 'lodash';
import requestNormalizer from '@/utils/requestNormalizer';

export function getAll(params = {}) {
    return request('/attendance/get_result_attendance', {
        prefix: API_URL_AI,
        method: 'GET',
        params: {
            ...params,
            user_id: isArray(params?.user_id) ? params?.user_id?.join(',') : params?.user_id,
            fromDate: Helper.getDateTime({
                value: Helper.setDate({
                    ...variables.setDateData,
                    originValue: params.fromDate,
                }),
                format: variables.DATE_FORMAT.DATE_AFTER,
                isUTC: false,
            }),
            toDate: Helper.getDateTime({
                value: Helper.setDate({
                    ...variables.setDateData,
                    originValue: params.toDate,
                }),
                format: variables.DATE_FORMAT.DATE_AFTER,
                isUTC: false,
            }),
        },
    });
}

export function update_result_ai(data = {}) {
    return request(`/attendance/update_result_ai/${data.id_object_attendance}`, {
        prefix: API_URL_AI,
        method: 'PUT',
        data,
    });
}

export function get(params = {}) {
    return request(`/attendance/get_data_by_user_id/${params?.userId}`, {
        prefix: API_URL_AI,
        method: 'GET',
        params: {
            // branch_cam: params?.branch_cam,
            // class_cam: params?.class_cam,
            page: params?.page,
            limit: params?.limit,
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

export function update(data) {
    return request('/identities/update_identity_v2', {
        prefix: API_URL_AI,
        method: 'PUT',
        data,
    });
}
