# Portfolio

Site public de Mattéo Bonneval (Nuxt 4). Le contenu (projets, articles, parcours, outils) et les
formulaires viennent de l'API Studio ; il n'y a plus de base de données ni d'administration ici.

## Développement

```bash
cp .env.example .env     # NUXT_STUDIO_API_URL pointe vers l'API Studio
npm install
npm run dev              # http://localhost:3000
```

L'API Studio doit tourner (voir le dépôt `studio`) et connaître le site `portfolio`.

## Comment le site parle à l'API

Le navigateur n'appelle jamais l'API directement : les pages appellent les routes Nitro de `server/api/`,
qui sont un adaptateur mince (`server/utils/studio.ts`) vers `/api/v1/sites/<site>/public/…`.
Il convertit les réponses vers les types de `shared/types/studio.ts`, et relaie l'IP et le User-Agent du
visiteur (limitation de débit et filtre des robots de l'API). Aucun CORS à ouvrir.

En production, l'API doit faire confiance à ce serveur pour `X-Forwarded-For` : mettre son adresse
(ou son réseau Docker) dans `TRUSTED_PROXIES` côté API.

## Production

```bash
npm run build
node --import ./.output/server/sentry.server.config.mjs .output/server/index.mjs
```

Variables : `NUXT_STUDIO_API_URL`, `NUXT_STUDIO_SITE`, `NUXT_TURNSTILE_SITE_KEY`, `NUXT_PUBLIC_SITE_URL`,
`NUXT_OG_IMAGE_SECRET`.
