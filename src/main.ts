import 'sanitize.css';
import 'sanitize.css/forms';
import 'sanitize.css/assets';
import 'sanitize.css/system-ui';
import 'sanitize.css/typography';
import 'sanitize.css/reduce-motion';
import 'sanitize.css/ui-monospace';

import '@/style.css';

const { NODE_ENV } = process.env;

(async () => {
  const isProduction = NODE_ENV === 'production';

  if (isProduction) {
    await import(/* webpackMode: "eager" */ '@/modules/tracking');
  }

  import(/* webpackMode: "eager" */ '@/index');
})();
