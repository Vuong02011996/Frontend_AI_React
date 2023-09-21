import request from '@/utils/request';
import { Helper, variables } from '@/utils';
import requestNormalizer from '@/utils/requestNormalizer';

export function get(params = {}) {
  return request(`/cameras/cam_id/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function connect(data = {}) {
  return request(`/cameras/check_connect_camera/${data.id}`, {
    prefix: API_URL_AI,
    method: 'POST',
    data,
  });
}

export function add(data = {}) {
  return request('/cameras/register', {
    prefix: API_URL_AI,
    method: 'POST',
    data,
    isNotification: true,
  });
}

export function update(data = {}) {
  return request(`/cameras/update/${data.id}`, {
    prefix: API_URL_AI,
    method: 'PUT',
    data,
    isNotification: true,
  });
}

export function remove(id) {
  return request(`/tool-details/${id}`, {
    method: 'DELETE',
    parse: true,
    isNotification: true,
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

export function statusJobs(params = {}) {
  return request(`/cameras/status_jobs/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function startRollCall(params = {}) {
  return request(`/roll_calls/start/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function stopRollCall(params = {}) {
  return request(`/roll_calls/stop/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function updateRollCall(data = {}) {
  return request(`/roll_calls/update/${data.id}`, {
    prefix: API_URL_AI,
    method: 'PUT',
    data,
  });
}

export function startSafeRegions(params = {}) {
  return request(`/safe_regions/start/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function stopSafeRegions(params = {}) {
  return request(`/safe_regions/stop/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function updateSafeRegions(data = {}) {
  return request(`/safe_regions/update/${data.id}`, {
    prefix: API_URL_AI,
    method: 'PUT',
    data,
  });
}

export function startBehaviors(params = {}) {
  return request(`/behaviors/start/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function stopBehaviors(params = {}) {
  return request(`/behaviors/stop/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function updateBehaviors(data = {}) {
  return request(`/behaviors/update/${data.id}`, {
    prefix: API_URL_AI,
    method: 'PUT',
    data,
  });
}

export function startSleepless(params = {}) {
  return request(`/sleepless/start/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function stopSleepless(params = {}) {
  return request(`/sleepless/stop/${params.id}`, {
    prefix: API_URL_AI,
    method: 'GET',
  });
}

export function updateSleepless(data = {}) {
  return request(`/sleepless/update/${data.id}`, {
    prefix: API_URL_AI,
    method: 'PUT',
    data,
  });
}
