import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

const { SENTRY_DSN } = process.env;

Sentry.init({
  dsn: SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
