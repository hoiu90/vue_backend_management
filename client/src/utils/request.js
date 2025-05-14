import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

const service = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 如果返回的状态码不是200，则判断为错误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '系统错误',
        type: 'error',
        duration: 5 * 1000
      });
      
      // 401: 未登录或token过期
      if (res.code === 401) {
        localStorage.removeItem('token');
        router.push('/login');
      }
      
      return Promise.reject(new Error(res.message || '系统错误'));
    } else {
      return res;
    }
  },
  error => {
    console.error('响应错误:', error);
    ElMessage({
      message: error.message || '请求失败',
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service; 