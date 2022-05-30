module.exports = {
  plugins: [
    [
      'postcss-preset-env',
      {
        stage: 3,
        features: {
          'custom-media-queries': true,
          'nesting-rules': true,
        },
      },
    ],
  ],
};
