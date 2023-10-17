import * as Sentry from '@sentry/react';

export function setupLogging() {
  Sentry.init({
    dsn: 'https://c55875c3b0904264a1a99e5b741a221e@o506079.ingest.sentry.io/5595379',
    autoSessionTracking: true,
    integrations: [
      new Sentry.BrowserTracing({
        beforeNavigate: (context) => ({
          ...context,
          // Assume any path segment starting with a digit is an ID, and replace
          // it with `:id`. This will help group related routes in Sentry stats.
          // NOTE: I'm a bit uncertain about the timing on this for tracking
          //       client-side navs... but we now only track first-time
          //       pageloads, and it definitely works correctly for them!
          name: window.location.pathname.replaceAll(/\/[0-9][^/]*/g, '/:id'),
        }),

        // We have a _lot_ of location changes that don't actually signify useful
        // navigations, like in the wardrobe page. It could be useful to trace
        // them with better filtering someday, but frankly we don't use the perf
        // features besides Web Vitals right now, and those only get tracked on
        // first-time pageloads, anyway. So, don't track client-side navs!
        startTransactionOnLocationChange: false,
      }),
    ],
    denyUrls: [
      // Don't log errors that were probably triggered by extensions and not by
      // our own app. (Apparently Sentry's setting to ignore browser extension
      // errors doesn't do this anywhere near as consistently as I'd expect?)
      //
      // Adapted from https://gist.github.com/impressiver/5092952, as linked in
      // https://docs.sentry.io/platforms/javascript/configuration/filtering/.
      /^chrome-extension:\/\//,
      /^moz-extension:\/\//,
    ],

    // Since we're only tracking first-page loads and not navigations, 100%
    // sampling isn't actually so much! Tune down if it becomes a problem, tho.
    tracesSampleRate: 1.0,
  });
}
