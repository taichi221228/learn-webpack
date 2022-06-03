process.chdir('./src');

const { remove } = require('fs-extra');
const { dirname, join, parse } = require('path');
const { sync } = require('glob');
const ESLintPlugin = require('eslint-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { ProvidePlugin } = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const outputPath = `${__dirname}/dist`;

const entryPoint = sync('./**/main.{js,ts}')[0];

const pageList = sync('./**/*.{html,pug}', {
  ignore: './{,_}{component,include,layout}{,s}/**',
});

const config = {
  entry: entryPoint,
  output: {
    path: outputPath,
    assetModuleFilename: 'assets/[path][name][ext]',
  },
  devServer: {
    open: {
      app: { name: 'google chrome' },
    },
    host: 'local-ipv4',
    watchFiles: {
      paths: [`./**/*.{html,pug}`],
      options: { liveReload: true },
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ESLintPlugin({ extensions: ['js', 'ts'] }),
    new StylelintPlugin({ extensions: ['css', 'pcss', 'scss'] }),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new DotenvPlugin({ path: `${__dirname}/.env` }),
    new SentryCliPlugin({
      include: outputPath,
      ignore: ['node_modules', 'webpack.config.js'],
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
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
    alias: { '@': '.' },
    extensions: [
      '.ts',
      '.js',
      '.css',
      '.pcss',
      '.sass',
      '.html',
      '.pug',
      '.eot',
      '.svg',
      '.ttf',
      '.woff',
      '.woff2',
      '.png',
      '.jpg',
      '.gif',
    ],
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
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true },
        },
      }),
    ],
  },
};

function addPageHandler(filename) {
  const basename = parse(filename).name;
  const outputDirname = dirname(filename.replace('pages/', ''));
  const outputFilename = join(outputDirname, `${basename}.html`);
  const handler = new HtmlPlugin({
    filename: outputFilename,
    template: filename,
    minify: false,
  });

  config.plugins.push(handler);
}

module.exports = () => {
  pageList.map((page) => addPageHandler(page));
  if (isProduction) {
    const outputFileList = sync(`${outputPath}/*`);
    outputFileList.map(async (outputFile) => await remove(outputFile));

    config.mode = 'production';
    config.devtool = 'source-map';
  } else {
    config.mode = 'development';
    config.devtool = 'eval';
  }
  return config;
};
