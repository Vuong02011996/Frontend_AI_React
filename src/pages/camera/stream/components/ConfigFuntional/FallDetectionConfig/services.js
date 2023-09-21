import request from '@/utils/request';

// Nếu dùng method :
// GET thì tham số là params
// PUT thì tham số là data

export function getCurrentConfig(params = {}) {
    return request(`/fall_detection/get_current_config/${params.id}`, {
        prefix: API_URL_AI_FALL_DETECTION,
        method: 'GET',
    });
}

// Button Lưu cấu hình
export function update(data = {}) {
    return request(`/fall_detection/update_config/${data.id}`, {
        prefix: API_URL_AI_FALL_DETECTION,
        method: 'PUT',
        data,
    });
}

export function start(params = {}) {
    return request(`/fall_detection/start/${params.id}`, {
        prefix: API_URL_AI_FALL_DETECTION,
        method: 'GET',
    });
}

export function stop(params = {}) {
    return request(`/fall_detection/stop/${params.process_name}`, {
        prefix: API_URL_AI_FALL_DETECTION,
        method: 'GET',
    });
}
