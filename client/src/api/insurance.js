import request from '@/utils/request';

// 获取保险列表
export function getInsuranceList(params) {
  return request({
    url: '/insurance/list',
    method: 'get',
    params
  });
}

// 获取保险详情
export function getInsuranceDetail(id) {
  return request({
    url: `/insurance/${id}`,
    method: 'get'
  });
}

// 创建保险产品
export function createInsurance(data) {
  return request({
    url: '/insurance/create',
    method: 'post',
    data
  });
}

// 更新保险产品
export function updateInsurance(id, data) {
  return request({
    url: `/insurance/${id}`,
    method: 'put',
    data
  });
}

// 删除保险产品
export function deleteInsurance(id) {
  return request({
    url: `/insurance/${id}`,
    method: 'delete'
  });
} 