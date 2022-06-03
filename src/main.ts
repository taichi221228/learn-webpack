const { NODE_ENV } = process.env;

(async () => {
  const isProduction = NODE_ENV === 'production';

  if (isProduction) {
    await import(/* webpackMode: "eager" */ '@/modules/tracking');
  }

  import(/* webpackMode: "eager" */ '@/index');
})();
