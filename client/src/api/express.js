import request from '@/utils/request';

// 获取快递列表
export function getExpressList(params) {
  return request({
    url: '/express/list',
    method: 'get',
    params
  });
}

// 获取快递详情
export function getExpressDetail(id) {
  return request({
    url: `/express/${id}`,
    method: 'get'
  });
}

// 创建快递订单
export function createExpress(data) {
  return request({
    url: '/express/create',
    method: 'post',
    data
  });
}

// 更新快递订单
export function updateExpress(id, data) {
  return request({
    url: `/express/${id}`,
    method: 'put',
    data
  });
}

// 删除快递订单
export function deleteExpress(id) {
  return request({
    url: `/express/${id}`,
    method: 'delete'
  });
} 