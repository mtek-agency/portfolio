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

## Organisation

```
app/
├── pages/            index, a-propos, projets/, blog/
├── layouts/          default (navigation, curseur, pied de page)
├── components/
│   ├── home/         sections de l'accueil (hero, projets, journal, outils, contact)
│   ├── projets/      carte, en-tête et frise de la liste des projets
│   ├── blog/         auteur et inscription à la newsletter d'un article
│   ├── site/         navigation et pied de page
│   ├── ui/           éléments transverses (curseur, grain, aimant, bandeau des technologies)
│   └── OgImage/      gabarit des images de partage
├── composables/
│   ├── forms/        jeton anti-robot (useCaptcha), inscription (useNewsletter)
│   └── motion/       apparition au scroll, cartes empilées, survols
├── plugins/          défilement fluide (Lenis)
└── utils/            dates, images, tags
server/
├── api/              routes Nitro : l'adaptateur vers l'API Studio (une route = une lecture ou un formulaire)
└── utils/studio/     client de l'API, conversions des réponses (mappers) et lectures
    (api/images/[...path] redirige les anciennes URLs d'images vers l'API Studio)
shared/
├── schemas/          validation des formulaires
└── types/studio.ts   formes consommées par les pages
```

## Intégration continue

`.github/workflows/ci.yml` : sur chaque pull request, lint, build et construction de l'image (sans publication) ;
sur `main`, publication de l'image dans le registre GitHub (`ghcr.io/mtek-agency/portfolio`, étiquettes `latest` et
`sha-<court>`), puis appel du webhook de déploiement Dokploy.

À configurer dans GitHub (Settings → Secrets and variables → Actions) :

| Nom | Type | Valeur |
|---|---|---|
| `DOKPLOY_DEPLOY_URL` | secret | l'URL du webhook de déploiement de l'application Dokploy |
| `NUXT_TURNSTILE_SITE_KEY` | variable | la clé **publique** Turnstile (lue à la construction) |

Dokploy doit pouvoir tirer l'image : la source de l'application est `ghcr.io/mtek-agency/portfolio:latest`, avec un
identifiant de registre (un jeton GitHub `read:packages`) si le paquet est privé.

## Production

```bash
npm run build
node --import ./.output/server/sentry.server.config.mjs .output/server/index.mjs
```

Variables : `NUXT_STUDIO_API_URL`, `NUXT_STUDIO_PUBLIC_URL`, `NUXT_STUDIO_SITE`, `NUXT_TURNSTILE_SITE_KEY`, `NUXT_PUBLIC_SITE_URL`,
`NUXT_OG_IMAGE_SECRET`.
