(async () => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    await import(/* webpackMode: "eager" */ '@/modules/tracking');
  }

  import(/* webpackMode: "eager" */ '@/index');
})();
