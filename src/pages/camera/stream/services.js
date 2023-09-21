import request from '@/utils/request';
// import { Helper, variables } from '@/utils';
// import requestNormalizer from '@/utils/requestNormalizer';

export function get(params = {}) {
    return request(`/stream/get_stream_cam/${params.id}`, {
        prefix: API_URL_AI,
        method: 'GET',
    });
}

export function get_show_region(params = {}) {
    return request(`/stream/get_stream_cam_show_region/${params.id}`, {
        prefix: API_URL_AI,
        method: 'GET',
        params,
    });
}
