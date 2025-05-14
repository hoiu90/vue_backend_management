import request from '@/utils/request';

// 获取二手商品列表
export function getSecondHandList(params) {
  return request({
    url: '/secondhand/list',
    method: 'get',
    params
  });
}

// 获取二手商品详情
export function getSecondHandDetail(id) {
  return request({
    url: `/secondhand/${id}`,
    method: 'get'
  });
}

// 创建二手商品
export function createSecondHand(data) {
  return request({
    url: '/secondhand/create',
    method: 'post',
    data
  });
}

// 更新二手商品
export function updateSecondHand(id, data) {
  return request({
    url: `/secondhand/${id}`,
    method: 'put',
    data
  });
}

// 删除二手商品
export function deleteSecondHand(id) {
  return request({
    url: `/secondhand/${id}`,
    method: 'delete'
  });
} 