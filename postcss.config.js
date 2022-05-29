module.exports = {
  // Add you postcss configuration here
  // Learn more about it at https://github.com/webpack-contrib/postcss-loader#config-files
  plugins: [
    [
      'postcss-preset-env',
      {
        /* use stage 3 features + css nesting rules */
        stage: 3,
        features: {
          'nesting-rules': true,
        },
      },
    ],
    'postcss-for',
    // 'postcss-calc',
  ],
};
