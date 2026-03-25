# ─────────────────────────────────────────────────────────
# Stage 1 — deps : installation des dépendances
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm i

# ─────────────────────────────────────────────────────────
# Stage 2 — dev : serveur de développement
# ─────────────────────────────────────────────────────────
FROM deps AS dev

ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ─────────────────────────────────────────────────────────
# Stage 3 — builder : build de production
# ─────────────────────────────────────────────────────────
FROM deps AS builder

WORKDIR /app

ARG NUXT_TURNSTILE_SITE_KEY
ENV NUXT_TURNSTILE_SITE_KEY=$NUXT_TURNSTILE_SITE_KEY

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . .

RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 4 — runner : image de production
# ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -g 1001 -S nuxt && adduser -u 1001 -S nuxt -G nuxt

COPY --from=builder --chown=nuxt:nuxt /app/.output ./.output

USER nuxt

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
