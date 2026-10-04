// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      titleTemplate: '%s — Mattéo Bonneval',
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

  modules: ['@nuxt/eslint', '@nuxt/scripts', '@nuxtjs/turnstile', '@nuxt/ui', '@nuxt/image', '@sentry/nuxt/module', '@nuxtjs/seo'],

  colorMode: {
    preference: 'light',
  },

  image: {
    provider: 'none',
  },

  // ─── SEO ──────────────────────────────────────────────────────────────────
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://matteo-bonneval.fr',
    name: 'Mattéo Bonneval',
    description: 'Développeur web & mobile basé à Bordeaux. Je transforme vos idées en solutions numériques.',
    defaultLocale: 'fr',
  },

  sitemap: {
    sources: [
      '/api/__sitemap__/projects',
      '/api/__sitemap__/posts',
    ],
  },

  ogImage: {
    enabled: true,
    runtimeCacheStorage: false,
    compatibility: {
      runtime: {
        satori: 'wasm',
        resvg: 'wasm',
        sharp: false,
      },
    },
  },

  schemaOrg: {
    reactive: true,
  },

  css: ['~/assets/css/main.css'],

  // Composables rangés par thème (composables/<thème>/useX.ts), tous auto-importés.
  imports: { dirs: ['composables/**'] },

  turnstile: {
    siteKey: process.env.NUXT_TURNSTILE_SITE_KEY,
  },

  runtimeConfig: {
    // API Studio : adresse du serveur (sans /api/v1) et slug du site de ce portfolio.
    // Surchargés au runtime par NUXT_STUDIO_API_URL et NUXT_STUDIO_SITE.
    studio: {
      apiUrl: 'http://localhost:8080',
      site: 'portfolio',
    },
  },

  sentry: {
    org: 'developpement-lc',
    project: 'mtek-portfolio'
  },

  sourcemap: {
    client: 'hidden'
  }
})