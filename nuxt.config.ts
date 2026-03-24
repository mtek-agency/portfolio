// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@nuxt/scripts',
    '@nuxtjs/turnstile',
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css'],
  hub: {
    db: 'postgresql',
    blob: {
      driver: 'fs',
      dir: '.data/files'
    },
    kv: true
  },
  turnstile: {
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
  },
  vite: {
    optimizeDeps: {
      include: [
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
      ],
    },
  },
  runtimeConfig: {
    admin: {
      email: process.env.NUXT_ADMIN_EMAIL,
      password: process.env.NUXT_ADMIN_PASSWORD
    },
    brevo: {
      apiKey: process.env.NUXT_BREVO_API_KEY,
      contactEmail: process.env.NUXT_CONTACT_EMAIL,
      senderEmail: process.env.NUXT_SENDER_EMAIL
    },
    turnstile: {
      // This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
      // environment variable.
      secretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    }
  }
})