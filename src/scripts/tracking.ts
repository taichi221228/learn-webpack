import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
  release: process.env.RELEASE,
});
