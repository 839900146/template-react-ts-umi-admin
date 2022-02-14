import path from 'path';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import server from './server';

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
};

export default {
  // 静态资源路径前缀
  publicPath: server.publicPath,
  // 网站二级目录
  base: server.base,
  chainWebpack: (config: any) => {
    config.when(process.env.NODE_ENV === 'production', (config: any) => {
      resetOutputDir(config);
      compressCode(config);

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
        resolve: {
          modules: [path.resolve(__dirname, './src'), path.resolve(__dirname, './node_modules')],
        },
      });
    });
  },
};
