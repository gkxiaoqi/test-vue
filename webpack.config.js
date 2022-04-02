const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // webpack5以上不能使用extract-text-webpack-plugin
const path = require('path'); // nodejs里面的基本包，用来处理路径
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = (env = {}) => {
  const mode = env.production ? 'production' : 'development';
  return {
    // 入口文件
    /*
     * path.resolve()方法可以将多个路径解析为一个规范化的绝对路径。其处理方式类似于对这些路径逐一进行cd操作
     * 与cd操作不同的是，路径可以是文件，并且可不必实际存在
     * resolve()方法不会利用底层的文件系统判断路径是否存在，而只是进行路径字符串操作
     */
    mode,
    entry: path.join(__dirname, 'src/main.js'),
    // 打包配置
    output: {
      filename: 'bundle.js',
      path: path.join(__dirname, 'dist'),
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
      },
      // 引入文件时不需要加后缀
      extensions: ['.js', '.vue'],
    },
    /**
     * plugin和loader的区别
     * plugin是一个扩展器，它丰富了webpack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点，执行广泛的任务
     * loader，它是一个转换器，将A文件进行编译形成B文件，这里操作的是文件，比如将A.scss转换为A.css，单纯的文件转换过程
     */
    plugins: [
      new webpack.DefinePlugin({
        // 不使用JSON.stringfy的话mode的值会被识别成变量，比如mode='production'，会试图读取production变量，使用'"production"'这种写法也行
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new VueLoaderPlugin(),
      // 将打包后的文件插入到一个html文件中
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './public/index.html',
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/env'], // 也可以写成presets: ['babel-preset-env']
              plugins: [['@babel/plugin-transform-runtime', { corejs: false }]],
            },
          },
          exclude: '/node_modules/',
        },
        {
          test: /\.vue$/,
          use: ['vue-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.styl(us)?$/,
          use: ['style-loader', 'css-loader', 'stylus-loader'],
        },
      ],
    },
    // 输出source-map方便调试
    devtool: 'source-map',
    // devServer的作用是开启一个开发用的服务器，用于快速开发，并会监听本地代码变动
    devServer: {
      // 设置成0.0.0.0可以同时监听localhost（即127.0.0.1）和本机局域网ip地址
      host: '0.0.0.0',
      // webpack4之前
      client: {
        overlay: {
          // 将错误信息直接展示到浏览器中
          errors: true,
        },
      },
      hot: true, // 开启模块热更替
    },
  };
};
