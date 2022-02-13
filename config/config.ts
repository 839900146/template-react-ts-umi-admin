// https://umijs.org/config/
import { defineConfig } from 'umi';
import path from 'path';
import CompressionWebpackPlugin from 'compression-webpack-plugin';

import defaultSettings from './defaultSettings';
import proxy from './proxy/index';
import routes from './routes';
import server from './server';

const { REACT_APP_ENV } = process.env;

//  重新设置静态资源输出目录
const resetOutputDir = (config) => {
  // 修改js，js chunk文件输出目录
  const assetDir = server.assetDir;
  config.output
    .filename(assetDir + '/js/[name].[fullhash:8].js')
    .chunkFilename(assetDir + '/js/[name].[chunkhash:8].chunk.js');

  // 修改css输出目录
  config.plugin('extract-css').tap(() => [
    {
      filename: `${assetDir}/css/[name].[chunkhash:8].css`,
      chunkFilename: `${assetDir}/css/[name].[chunkhash:8].chunk.css`,
      ignoreOrder: true,
    },
  ]);

  // 修改图片输出目录
  config.module
    .rule('images')
    .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
    .use('url-loader')
    .loader(require.resolve('url-loader'))
    .tap((options) => {
      const newOptions = {
        ...options,
        name: assetDir + '/img/[name].[hash:8].[ext]',
        fallback: {
          ...options.fallback,
          options: {
            name: assetDir + '/img/[name].[hash:8].[ext]',
            esModule: false,
          },
        },
      };
      return newOptions;
    });
};

export default defineConfig({
  publicPath: server.publicPath,
  base: server.base,
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
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
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  nodeModulesTransform: { type: 'none' },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  terserOptions: {},
  chainWebpack: (config, { webpack }) => {
    config.when(process.env.NODE_ENV === 'production', (config) => {
      resetOutputDir(config);

      config.plugin('compression-webpack-plugin').use(CompressionWebpackPlugin, [
        {
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp('\\.(js|css)$'),
          threshold: 20480,
          minRatio: 0.6,
        },
      ]);
      config.merge({
        optimization: {
          minimize: true,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            minChunks: 2,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
              antd: {
                chunks: 'all',
                name: 'antd',
                test: /[\\/]node_modules[\\/](antd|@antd)[\\/]/,
                priority: 10,
              },
              designpro: {
                chunks: 'async',
                name: 'designpro',
                test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
                priority: 10,
                reuseExistingChunk: true,
              },
              routeutils: {
                chunks: 'async',
                name: 'route-utils',
                test: /[\\/]node_modules[\\/]@umijs[\\/]route\-utils/,
                priority: 20,
              },
              g2plot: {
                chunks: 'async',
                name: 'g2plot',
                test: (module) => /g2plot/.test(module.context),
                priority: 11,
                reuseExistingChunk: true,
              },
              g6: {
                chunks: 'async',
                name: 'g6',
                test: (module) => /g6/.test(module.context),
                priority: 11,
                reuseExistingChunk: true,
              },
              lodash: {
                chunks: 'async',
                name: 'lodash',
                test: /[\\/]node_modules[\\/]lodash[\\/]/,
                priority: 9,
                reuseExistingChunk: true,
              },
              moment: {
                chunks: 'async',
                name: 'moment',
                test: /[\\/]node_modules[\\/]moment[\\/]/,
                priority: 11,
                reuseExistingChunk: true,
              },
              xlsx: {
                chunks: 'async',
                name: 'xlsx',
                test: /[\\/]node_modules[\\/]xlsx[\\/]/,
                priority: 8,
                reuseExistingChunk: true,
              },
              jsExportExcel: {
                chunks: 'async',
                name: 'js-export-excel',
                test: /[\\/]node_modules[\\/]js-export-excel[\\/]/,
                priority: 8,
                reuseExistingChunk: true,
              },
              vendors: {
                chunks: 'all',
                name: 'vendors',
                minChunks: 2,
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
              },
              default: {
                priority: -10,
              },
            },
          },
        },
        resolve: {
          modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './node_modules')],
        },
      });
    });
  },
});
