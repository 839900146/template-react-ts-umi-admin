import { extend } from 'umi-request';
import type { RequestOptionsInit } from 'umi-request';
import { notification } from 'antd';
import server from '../../config/server';
import { GetToken } from '@/utils';
const { REACT_APP_ENV } = process.env;
const apiPrefix: ApiPrefix = server.apiPrefix;

type mapErrCode = 400 | 401 | 403 | 404 | 500;

const CodeMessage = {
  400: '请求错误',
  401: '权限错误',
  403: '服务器拒绝请求',
  404: '资源不存在',
  500: '服务器错误',
};

/**
 * 错误处理
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    let errorText = CodeMessage[response.status as mapErrCode] || response.statusText;
    const { status, url } = response;
    response
      .clone()
      .json()
      .then((res) => {
        errorText = res.msg || errorText;
      });
    notification.error({
      message: `请求出错 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      message: '网络异常',
      description: '您的网络出现异常, 无法连接服务器',
    });
  }
  return response;
};

const request = extend({
  errorHandler,
  credentials: 'include',
});

request.interceptors.request.use((url: string, options: RequestOptionsInit) => {
  const headers = {
    [server.tokenKeyInRequest]: GetToken() || '',
  };
  return {
    url: `${apiPrefix[REACT_APP_ENV || 'prd']}${url}`,
    options: { ...options, interceptors: true, headers },
  };
});

export default {
  get: async (url: string, parameter?: Record<string, unknown>): Promise<any> => {
    try {
      return await request(url, { method: 'get', params: parameter });
    } catch (error) {
      console.error(error);
    }
  },
  post: async (url: string, parameter?: Record<string, unknown>): Promise<any> => {
    try {
      return await request(url, { method: 'post', data: parameter });
    } catch (error) {
      console.error(error);
    }
  },
  delete: async (url: string, parameter?: Record<string, unknown>): Promise<any> => {
    try {
      return await request(url, { method: 'delete', params: parameter });
    } catch (error) {
      console.error(error);
    }
  },
  put: async (url: string, parameter?: Record<string, unknown>): Promise<any> => {
    try {
      return await request(url, { method: 'put', data: parameter });
    } catch (error) {
      console.error(error);
    }
  },
};
