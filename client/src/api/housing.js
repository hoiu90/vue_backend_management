import request from '@/utils/request';

// 获取租房列表
export function getHousingList(params) {
  return request({
    url: '/housing/list',
    method: 'get',
    params
  });
}

// 获取租房详情
export function getHousingDetail(id) {
  return request({
    url: `/housing/${id}`,
    method: 'get'
  });
}

// 创建租房信息
export function createHousing(data) {
  return request({
    url: '/housing/create',
    method: 'post',
    data
  });
}

// 更新租房信息
export function updateHousing(id, data) {
  return request({
    url: `/housing/${id}`,
    method: 'put',
    data
  });
}

// 删除租房信息
export function deleteHousing(id) {
  return request({
    url: `/housing/${id}`,
    method: 'delete'
  });
} 