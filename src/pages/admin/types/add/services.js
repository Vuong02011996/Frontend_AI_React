import request from '@/utils/request';

export function get(params = {}) {
  return request(`/tool-details/${params.id}`, {
    method: 'GET',
  });
}

export function add(data = {}) {
  return request('/tool-details', {
    method: 'POST',
    data,
  });
}

export function update(data = {}) {
  return request(`/tool-details/${data.id}`, {
    method: 'PUT',
    data,
  });
}

export function remove(id) {
  return request(`/tool-details/${id}`, {
    method: 'DELETE',
    parse: true,
  });
}

export default get;
