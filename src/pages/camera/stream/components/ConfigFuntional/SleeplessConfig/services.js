import request from '@/utils/request';

// Nếu dùng method :
// GET thì tham số là params
// PUT thì tham số là data

export function getCurrentConfig(params = {}) {
    return request(`/sleepless/get_current_config/${params.id}`, {
        prefix: API_URL_AI,
        method: 'GET',
    });
}

// Button Lưu cấu hình
export function update(data = {}) {
    return request(`/sleepless/update_config/${data.id}`, {
        prefix: API_URL_AI,
        method: 'PUT',
        data,
    });
}

export function start(params = {}) {
    return request(`/sleepless/start/${params.id}`, {
        prefix: API_URL_AI,
        method: 'GET',
    });
}

export function stop(params = {}) {
    return request(`/sleepless/stop/${params.process_name}`, {
        prefix: API_URL_AI,
        method: 'GET',
    });
}
