// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      titleTemplate: '%s | mtek agency',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;1,14..32,400&display=swap' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/favicon/site.webmanifest' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
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
    db: {
      dialect: 'postgresql',
      applyMigrationsDuringBuild: false
    },
    blob: {
      driver: 'fs',
      dir: '.data/files'
    },
    kv: true
  },
  $production: {
    hub: {
      blob: {
        driver: 's3',
        bucket: process.env.CLOUDFLARE_R2_BUCKET ?? 'portfolio',
        endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        region: 'auto',
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      }
    }
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