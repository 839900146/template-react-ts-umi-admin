/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 */
import dev from './dev';

let proxyConfig = {
  dev: {},
};

dev.forEach((item) => {
  proxyConfig.dev[item.prefix] = {
    target: item.target,
    pathRewrite: item.pathRewrite || null,
    changeOrigin: true,
  };
});

export default proxyConfig;
