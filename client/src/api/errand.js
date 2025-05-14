import request from '@/utils/request';

// 获取跑腿服务列表
export function getErrandList(params) {
  return request({
    url: '/errand/list',
    method: 'get',
    params
  });
}

// 获取跑腿服务详情
export function getErrandDetail(id) {
  return request({
    url: `/errand/${id}`,
    method: 'get'
  });
}

// 创建跑腿服务
export function createErrand(data) {
  return request({
    url: '/errand/create',
    method: 'post',
    data
  });
}

// 更新跑腿服务
export function updateErrand(id, data) {
  return request({
    url: `/errand/${id}`,
    method: 'put',
    data
  });
}

// 删除跑腿服务
export function deleteErrand(id) {
  return request({
    url: `/errand/${id}`,
    method: 'delete'
  });
} 