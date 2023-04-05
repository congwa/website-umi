// 运行时配置

import { message } from 'antd';
import { history, RunTimeLayoutConfig, RequestConfig } from '@umijs/max';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{ name: string }> {
  return { name: 'biomed168' };
}

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: false,
    menu: {
      locale: false,
    },
    logout: () => {
      localStorage.clear();
      history.push('/login');
    },
  };
};

export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 40000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: any) => {
      const { success, data, errorCode, errorMessage, showType } = res;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error?.data && Object.keys(error?.data).length) {
        let infos = Object.values(error.data);
        message.error('Response status:' + JSON.stringify(infos));
      } else if (error.name === 'BizError') {
        const errorInfo: any | undefined = error.info;
        if (errorInfo) {
          const { errorMessage } = errorInfo;
          message.error(errorMessage);
        }
      } else if (error.response) {
        console.log(error.response);
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(
          'Response status:' +
            error.response.status +
            (Array.isArray(error.response.data.message)
              ? JSON.stringify(error.response.data.message)
              : error.response.data.message),
        );
        message.error(
          'Response status:' +
            error.response.status +
            (Array.isArray(error.response.data.message)
              ? JSON.stringify(error.response.data.message)
              : error.response.data.message),
        );
        if (error.response?.status === 401) {
          localStorage.clear();
          history.push('/login');
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (url: any, options: any) => {
      const token = localStorage.getItem('token');
      const { headers = {} } = options || {};
      const tokenHeaders = {
        Authorization: 'Bearer ' + token,
        ...headers,
      };

      if (options.method?.toUpperCase() === 'GET') {
        options.params = options.data;
      } else {
        //我们的请求参数和后端约定的是除了一些特殊情况使用formData 其他都使用form格式，因此默认是使用form格式
        options.requestType = options.requestType
          ? options.requestType
          : 'form';
      }
      return {
        url,
        options: { ...options, headers: tokenHeaders },
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;
      if (data.code !== 0) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        data?.msg && message.error(data?.msg);
        return Promise.reject(data);
      }
      return response;
    },
  ],
};
