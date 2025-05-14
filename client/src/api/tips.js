import request from '@/utils/request';

// 获取省钱技巧列表
export function getTipsList(params) {
  return request({
    url: '/tips/list',
    method: 'get',
    params
  });
}

// 获取省钱技巧详情
export function getTipsDetail(id) {
  return request({
    url: `/tips/${id}`,
    method: 'get'
  });
}

// 创建省钱技巧
export function createTips(data) {
  return request({
    url: '/tips/create',
    method: 'post',
    data
  });
}

// 更新省钱技巧
export function updateTips(id, data) {
  return request({
    url: `/tips/${id}`,
    method: 'put',
    data
  });
}

// 删除省钱技巧
export function deleteTips(id) {
  return request({
    url: `/tips/${id}`,
    method: 'delete'
  });
} 