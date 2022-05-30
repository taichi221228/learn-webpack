process.chdir('./src');

const path = require('path');
const glob = require('glob');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const entryPoint = glob.sync('./**/main.{js,ts}')[0];

const stylesHandler = MiniCssExtractPlugin.loader;

const pageList = glob.sync('./**/*.{html,pug}', { ignore: './components/**' });

const config = {
  entry: entryPoint,
  output: {
    path: `${__dirname}/dist`,
    assetModuleFilename: 'assets/[path][name][ext]',
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ESLintWebpackPlugin({
      extensions: ['js', 'ts'],
    }),
    new StylelintWebpackPlugin({
      extensions: ['css', 'pcss', 'scss'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(css|pcss)$/i,
        use: [stylesHandler, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.sass$/i,
        use: 'sass-loader',
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-loader',
            options: { pretty: true },
          },
        ],
      },
      {
        test: /\.(html|eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: { '@': `${__dirname}/src` },
    extensions: ['.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'assets/scripts/vendors',
          chunks: 'all',
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  },
};

function addPageHandler(filename) {
  const basename = path.parse(filename).name;
  const outputDirname = path.dirname(filename.replace('pages/', ''));
  const outputFilename = path.join(outputDirname, `${basename}.html`);
  const handler = new HtmlWebpackPlugin({
    filename: outputFilename,
    template: filename,
    minify: false,
  });

  config.plugins.push(handler);
}

module.exports = () => {
  pageList.map((page) => addPageHandler(page));
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
