// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy/index';
import routes from './routes';
import build from './build';

const { REACT_APP_ENV } = process.env;

// @ts-ignore
export default defineConfig({
  // 文件名采用哈希拼接
  hash: true,
  antd: {},
  dva: {
    // model热更新
    hmr: true,
    // 兼容至ie11
    immer: { enableES5: true },
    // 禁止model类型导出至umi
    disableModelsReExport: true,
    // 启用model懒加载, 防止umi变量出现循环引用
    lazyLoad: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  // 关闭国际化
  locale: false,
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  // 忽略momentjs的语言文件
  ignoreMomentLocale: true,
  // 前端反向代理配置, 默认采取dev方案
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新, 一般我们选择关闭, 因为它虽然可以保存界面state, 但却会影响界面样式的热更新
  // fastRefresh: {},
  // 禁止babel编译node_modules下的文件
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  // 如果项目用到了动态路由, 例如/web/user/:id, 并且你的电脑是windows操作系统, 就必须把下面这个exportStatic注释掉,否则无法编译打包
  exportStatic: {},
  // 开启代码压缩
  terserOptions: {},
  cssLoader: {
    // css驼峰式类名转中划线类名
    localsConvention: 'camelCase',
  },
  ...build,
});
