import $ from 'jquery';

import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/assets.css';
import 'sanitize.css/system-ui.css';
import 'sanitize.css/typography.css';
import 'sanitize.css/reduce-motion.css';
import 'sanitize.css/ui-monospace.css';

import '@/main.pcss';

$('h1').each(() => {
  $(this).append('!');
});
