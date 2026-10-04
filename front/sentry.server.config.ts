import * as Sentry from "@sentry/nuxt";
 
Sentry.init({
  dsn: "https://e14ac87e4bb03416c5ac57da3feafea3@o4510167105011712.ingest.de.sentry.io/4511105818230864",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 0.2,

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Enable sending of user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
