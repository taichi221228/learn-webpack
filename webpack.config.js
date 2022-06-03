process.chdir('./src');

const path = require('path');
const glob = require('glob');
const ESLintPlugin = require('eslint-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { ProvidePlugin } = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const entryPoint = glob.sync('./**/main.{js,ts}')[0];

const stylesHandler = MiniCssExtractPlugin.loader;

const pageList = glob.sync('./**/*.{html,pug}', {
  ignore: './{,_}{component,include,layout}{,s}/**',
});

const config = {
  entry: entryPoint,
  output: {
    path: `${__dirname}/dist`,
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
      release: process.env.RELEASE,
      include: `${__dirname}/dist`,
      ignore: ['node_modules', 'webpack.config.js'],
      // configFile: `${__dirname}/.sentryclirc`
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
  const basename = path.parse(filename).name;
  const outputDirname = path.dirname(filename.replace('pages/', ''));
  const outputFilename = path.join(outputDirname, `${basename}.html`);
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
    config.mode = 'production';
    config.devtool = 'hidden-source-map';
  } else {
    config.mode = 'development';
    config.devtool = 'eval';
  }
  return config;
};
