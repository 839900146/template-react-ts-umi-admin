/**
 * 如果没有特殊需要, 不建议再对本文件做修改
 */

import path from 'path';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import server from './server';
import pkg from '../package.json';
const isProduction = process.env.NODE_ENV === 'production';
// CDN配置
const CdnConfig = {
  externals: {
    react: 'window.React',
    'react-dom': 'window.ReactDOM',
    moment: 'window.moment',
    lodash: 'window._',
  },
  scripts: [
    'https://cdn.bootcdn.net/ajax/libs/react/17.0.0/umd/react.production.min.js',
    'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.0/umd/react-dom.production.min.js',
    'https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.0/moment.min.js',
    'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.0/lodash.min.js',
  ],
};
const moduleSplitRule = {
  antd: {
    chunks: 'all',
    name: 'antd',
    test: /[\\/]node_modules[\\/](antd|@antd)[\\/]/,
    priority: 10,
  },
  '@ant-design': {
    chunks: 'all',
    name: '@ant-design',
    test: /[\\/]node_modules[\\/]@ant-design/,
    priority: 10,
    reuseExistingChunk: true,
  },
  antv: {
    chunks: 'async',
    name: 'antv',
    test: (module: any) => /@antv/.test(module.context),
    priority: 9,
    reuseExistingChunk: false,
  },
  g2plot: {
    chunks: 'async',
    name: 'g2plot',
    test: (module: any) => /g2plot/.test(module.context),
    priority: 11,
    reuseExistingChunk: true,
  },
  g6: {
    chunks: 'async',
    name: 'g6',
    test: (module: any) => /g6/.test(module.context),
    priority: 11,
    reuseExistingChunk: true,
  },
  mapvgl: {
    chunks: 'async',
    name: 'mapvgl',
    test: /[\\/]node_modules[\\/]mapvgl[\\/]/,
    priority: 8,
    reuseExistingChunk: false,
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
  'js-export-excel': {
    chunks: 'async',
    name: 'js-export-excel',
    test: /[\\/]node_modules[\\/]js-export-excel[\\/]/,
    priority: 8,
    reuseExistingChunk: true,
  },
  'react-dom': {
    chunks: 'all',
    name: 'react-dom',
    test: /[\\/]node_modules[\\/]react-dom/,
    priority: 8,
    reuseExistingChunk: true,
  },
};

//  重新设置静态资源输出目录
const resetOutputDir = (config: any) => {
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
    .tap((options: any) => {
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

// 代码压缩
const compressCode = (config: any) => {
  config.plugin('compression-webpack-plugin').use(CompressionWebpackPlugin, [
    {
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: new RegExp('\\.(js|css)$'),
      threshold: 20480,
      minRatio: 0.6,
    },
  ]);
};

// 代码分割
const splitCacheGroups = {
  'core-js': {
    chunks: 'all',
    name: 'core-js',
    test: /[\\/]node_modules[\\/]core-js/,
    priority: 8,
    reuseExistingChunk: true,
  },
  '@umijs': {
    chunks: 'all',
    name: '@umijs',
    test: /[\\/]node_modules[\\/]@umijs/,
    priority: 20,
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
};

// 设置代码切割选项
const PkgKeys = Object.keys(pkg.dependencies);
const ModuleSplitKeys = Object.keys(moduleSplitRule);
for (let i = 0; i < PkgKeys.length; i++) {
  let index = ModuleSplitKeys.findIndex((key) => {
    return PkgKeys[i].includes(key);
  });

  if (index > -1) {
    splitCacheGroups[ModuleSplitKeys[index]] = moduleSplitRule[ModuleSplitKeys[index]];
  }
}

export default {
  // 静态资源路径前缀
  publicPath: server.publicPath,
  // 网站二级目录
  base: server.base,
  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  ...CdnConfig,
  chainWebpack: (config: any) => {
    config.when(isProduction, (config: any) => {
      // 执行路径重置
      resetOutputDir(config);
      // 执行代码压缩
      compressCode(config);
      // 合并代码切割配置
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
            cacheGroups: splitCacheGroups,
          },
        },
        // 路径查找优化
        resolve: {
          modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './node_modules')],
        },
      });
    });
  },
};
