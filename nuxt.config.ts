// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxthub/core', 'nuxt-auth-utils'],
  hub: {
    db: 'postgresql',
    blob: {
      driver: 'fs',
      dir: '.data/files'
    }
  },
  runtimeConfig: {
    admin: {
      email: process.env.NUXT_ADMIN_EMAIL,
      password: process.env.NUXT_ADMIN_PASSWORD
    }
  }
})