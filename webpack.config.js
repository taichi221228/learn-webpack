process.chdir('./src');

const { remove } = require('fs-extra');
const { sync } = require('glob');
const { dirname, join, parse } = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SentryCliPlugin = require('@sentry/webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { ProvidePlugin } = require('webpack');

const { NODE_ENV } = process.env;

const isProduction = NODE_ENV === 'production';

const outputPath = `${__dirname}/dist`;

const entryPoint = sync('./**/main.{js,ts}')[0];

const pageList = sync('./**/*.{html,pug,jsx}', {
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
      paths: [`./**/*.{html,pug,jsx}`],
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
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/react'],
            },
          },
        ],
      },
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
        test: /\.(sass|scss)$/i,
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
      '.jsx',
      '.css',
      '.pcss',
      '.sass',
      '.scss',
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

function addPageHandler(filename, options) {
  const basename = parse(filename).name;
  const outputDirname = dirname(filename.replace('pages/', ''));
  const outputFilename = join(outputDirname, `${basename}.html`);
  const handler = new HtmlPlugin({
    filename: outputFilename,
    template: filename,
    ...options,
  });

  config.plugins.push(handler);
}

module.exports = () => {
  const pageOptions = {
    minify: {
      collapseInlineTagWhitespace: true,
      keepClosingSlash: true,
      noNewlinesBeforeTagClose: true,
      preserveLineBreaks: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
    },
  };

  if (isProduction) {
    const outputFileList = sync(`${outputPath}/*`);
    outputFileList.map(async (outputFile) => await remove(outputFile));

    pageOptions.minify = {
      ...pageOptions.minify,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeComments: true,
      useShortDoctype: true,
    };

    const trackingHandler = new SentryCliPlugin({
      include: outputPath,
      ignore: ['node_modules', 'webpack.config.js'],
    });

    config.mode = 'production';
    config.devtool = 'source-map';
    config.plugins.push(trackingHandler);
  } else {
    config.mode = 'development';
    config.devtool = 'eval';
  }

  pageList.map((page) => addPageHandler(page, pageOptions));

  return config;
};
