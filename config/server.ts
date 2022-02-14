// @ts-nocheck
export default {
  /**
   * token保存至localStorage中的键
   */
  tokenKey: 'webapp-user-token',
  /**
   * 设置在xhr headers中token的键
   */
  tokenKeyInRequest: 'userToken',
  /**
   * 不同环境下, 发送请求的前缀
   */
  apiPrefix: {
    dev: 'http://localhost:8888/api',
    prd: '/api',
    test: 'http://localhost:8888/api',
  },
  /**
   * 前端代理服务器
   */
  proxyServer: {
    server1: 'http://localhost:8001',
    server2: 'http://localhost:8002',
    server3: 'http://localhost:8003',
    server4: 'http://localhost:8004',
  },
  /**
   * 静态资源存放目录
   */
  assetDir: 'static',
  /**
   * 静态资源路径前缀
   */
  publicPath: '/',
  /**
   * 网站二级目录
   */
  base: '/web/',
};
