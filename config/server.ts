// @ts-nocheck
export default {
  /**
   * token保存至localStorage中的键
   */
  tokenKey: 'webapp-User-token',
  /**
   * 设置在xhr headers中token的键
   */
  tokenKeyInRequest: 'userToken',
  /**
   * 不同环境下, 发送请求的前缀
   */
  apiPrefix: {
    dev: '/dev/api',
    prd: '/prd/api',
    test: '/test/api',
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

  /**
   * 需要注入的全局数据（打包后仍然有效，会自动挂载到window对象身上）
   */
  injectData: process.env,
};
