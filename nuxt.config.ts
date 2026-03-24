// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | mtek agency',
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
  },
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