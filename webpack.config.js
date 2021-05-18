const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;

const devMode = process.argv[process.argv.indexOf('--mode') + 1] === 'development';

const MEDIA_PATH = !devMode ? '//media.easy.cl/is/image/EasySA' : `/assets`;
const FILE_TYPE = !devMode ? '' : '.png';

const HTML = {
  test: /.pug$/,
  use: [
    {
      loader: 'string-replace-loader',
      options: {
        multiple: [
          { search: /@MEDIA_PATH@/g, replace: MEDIA_PATH },
          { search: /@FILE_TYPE@/g, replace: FILE_TYPE },
          { search: /@SRC@/g, replace: 'src' },
          { search: /@SRCSET@/g, replace: 'srcset' },
        ],
      },
    },
    { loader: 'html-loader' },
    {
      loader: 'pug-html-loader',
    },
  ],
};

const CSS = {
  test: /\.s[ac]ss$/i,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
};

const PLUGINS = devMode
  ? [
      new HtmlWebpackPlugin({
        filename: `index.html`,
        template: `./src/pug/index.pug`,
        inject: 'body',
        minify: false,
      }),
      new MiniCssExtractPlugin(),
      new BeautifyHtmlWebpackPlugin(),
    ]
  : [
      new HtmlWebpackPlugin({
        filename: `index.html`,
        template: `./src/pug/index.pug`,
        inject: 'body',
        // minify: false,
      }),
      new MiniCssExtractPlugin(),
      new HTMLInlineCSSWebpackPlugin(),
      new HtmlReplaceWebpackPlugin([
        {
          pattern: devMode ? '' : /<script\b[^>]*>([\s\S]*?)<\/script>/gm,
          replacement: '',
        },
      ]),
      new BeautifyHtmlWebpackPlugin(),
    ];

const config = (mode) => {
  return {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      publicPath: '/',
      path: path.resolve(__dirname, './build'),
      clean: true,
    },
    devServer: {
      open: true,
      port: 3500,
      liveReload: true,
    },
    module: {
      rules: [HTML, CSS],
    },
    plugins: PLUGINS,
  };
};
module.exports = (env, arvg) => config(arvg.mode);
