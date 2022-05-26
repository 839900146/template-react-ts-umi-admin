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
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react/17.0.0/umd/react.production.min.js',
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/react-dom/17.0.0/umd/react-dom.production.min.js',
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/moment.js/2.29.0/moment.min.js',
    'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/lodash.js/4.17.0/lodash.min.js',
  ],
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
      return {
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

// 自定义代码分割规则
const CustomSplitCacheGroups = {
  antd: {
    name: 'antd',
    minChunks: 1,
    test: /[\\/]node_modules[\\/](antd|@antd|@ant-design)[\\/]?/,
    priority: 20,
    reuseExistingChunk: true,
  },
  '@ant-design/charts': {
    name: '@ant-design-charts',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@antv[\\/]g2plot(-(.*))?[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  '@antv/g2': {
    name: 'antv-g2',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@antv[\\/]g2(-(.*))?[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  '@antv/g6': {
    name: 'antv-g6',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@antv[\\/]g6(-(.*))?[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  '@antv/x6': {
    name: 'antv-x6',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@antv[\\/]x6(-(.*))?[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  echarts: {
    name: 'echarts',
    minChunks: 1,
    test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  xlsx: {
    name: 'xlsx',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]xlsx[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  'js-export-excel': {
    name: 'js-export-excel',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]js-export-excel[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
  '@jiaminghi/data-view-react': {
    name: 'data-view-react',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@jiaminghi[\\/]data-view-react[\\/]/,
    priority: 20,
    reuseExistingChunk: true,
  },
};

// 默认代码分割规则
const DefaultSplitCacheGroups = {
  'core-js': {
    name: 'core-js',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]core-js/,
    priority: 20,
    reuseExistingChunk: true,
  },
  '@umijs': {
    name: '@umijs',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@umijs/,
    priority: 20,
  },
  dva: {
    name: 'dva',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]dva/,
    priority: 20,
    reuseExistingChunk: true,
  },
  'react-color': {
    name: 'react-color',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]react-color/,
    priority: 20,
    reuseExistingChunk: true,
  },
  rc: {
    name: 'rc',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]rc-(.+)[\\/]es/,
    priority: 20,
  },
  '@antv': {
    name: 'antv-basic',
    minChunks: 1,
    test: /[\\/]node_modules[\\/]@antv[\\/]/,
    priority: 10,
    reuseExistingChunk: true,
  },
  vendors: {
    name: 'vendors',
    test: /[\\/]node_modules[\\/]/,
    priority: -10,
    reuseExistingChunk: true,
  },
};

// 设置代码切割选项
const PkgKeys = Object.keys(pkg.dependencies);
const ModuleSplitKeys = Object.keys(CustomSplitCacheGroups);
for (let i = 0; i < PkgKeys.length; i++) {
  let index = ModuleSplitKeys.findIndex((key) => {
    return PkgKeys[i].includes(key);
  });

  if (index > -1) {
    DefaultSplitCacheGroups[ModuleSplitKeys[index]] =
      CustomSplitCacheGroups[ModuleSplitKeys[index]];
  }
}

export default {
  // 静态资源路径前缀
  publicPath: server.publicPath,
  // 网站二级目录
  base: server.base,
  devtool: isProduction ? false : 'eval-cheap-module-source-map',
  define: server.injectData || {},
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@pages': path.resolve(__dirname, '../src/pages'),
    '@services': path.resolve(__dirname, '../src/services'),
    '@models': path.resolve(__dirname, '../src/models'),
    '@utils': path.resolve(__dirname, '../src/utils'),
    '@components': path.resolve(__dirname, '../src/components'),
  },
  ...CdnConfig,
  chunks: ['vendors', 'core-js', 'dva', 'react-color', 'rc', '@umijs', 'umi', 'antd'],
  chainWebpack: (config: any) => {
    if (isProduction) {
      // 执行路径重置
      resetOutputDir(config);
      // 执行代码压缩
      compressCode(config);
    }
    // 合并代码切割配置
    config.merge({
      cache: {
        type: 'filesystem',
      },
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 2,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: DefaultSplitCacheGroups,
        },
      },
      // 路径查找优化
      resolve: {
        modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './node_modules')],
      },
    });
  },
};
