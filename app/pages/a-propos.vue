<script setup lang="ts">
import type { Parcours } from '~~/server/db/schema'

useSeoMeta({
  title: 'À propos — Mattéo Bonneval',
  description: 'Développeur web & mobile fullstack basé à Bordeaux. Étudiant en Master Dev Manager Fullstack à l\'EFREI, je conçois des applications propres, performantes et maintenables.',
  twitterCard: 'summary_large_image',
  ogLocale: 'fr_FR',
})

defineOgImage({
  component: 'Portfolio',
  title: 'À propos',
  description: 'Développeur fullstack basé à Bordeaux, en Master Dev Manager à l\'EFREI.',
  label: 'Qui suis-je',
})

useSchemaOrg([
  definePerson({
    name: 'Mattéo Bonneval',
    url: 'https://matteo-bonneval.fr',
    image: 'https://matteo-bonneval.fr/hero.webp',
    sameAs: [
      'https://www.linkedin.com/in/matteo-bonneval',
      'https://github.com/matteobnvl',
    ],
    jobTitle: 'Développeur Web & Mobile',
    alumniOf: 'EFREI Paris',
    knowsAbout: ['Développement web', 'Développement mobile', 'TypeScript', 'Vue.js', 'Node.js'],
  }),
])

const { data: parcoursData } = await useFetch<Parcours[]>('/api/parcours/public')
const parcours = computed(() => parcoursData.value ?? [])

const { el: bioEl, isVisible: bioVisible } = useReveal({ threshold: 0.1 })
const { el: timelineEl, isVisible: timelineVisible } = useReveal({ threshold: 0.05 })
const { el: valuesEl, isVisible: valuesVisible } = useReveal({ threshold: 0.1 })
const { el: ctaEl, isVisible: ctaVisible } = useReveal({ threshold: 0.2 })

const valeurs = [
  {
    index: '01',
    title: 'Code propre avant tout',
    description: 'J\'écris du code pour qu\'il tienne dans le temps, lisible, maintenable, scalable. Livrer vite en accumulant de la dette technique, c\'est juste repousser le problème.',
  },
  {
    index: '02',
    title: 'Fullstack sans frontières',
    description: 'À l\'aise côté back comme côté interface, je ne m\'enferme pas dans un seul rôle. Comprendre l\'ensemble me permet de prendre de meilleures décisions à chaque étape.',
  },
  {
    index: '03',
    title: 'Curiosité comme moteur',
    description: 'J\'explore les technologies pour vraiment comprendre comment elles fonctionnent, pas pour cocher des cases sur un CV. C\'est ce qui me permet de choisir le bon outil pour le bon problème.',
  },
  {
    index: '04',
    title: 'Projets concrets d\'abord',
    description: 'J\'apprends en construisant des choses réelles. La théorie est utile, mais c\'est en se confrontant à de vrais problèmes qu\'on progresse vraiment.',
  },
]

const { onMouseMove, onMouseLeave, cardStyle: tiltCardStyle } = useToolCard()
</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-950">

    <!-- ─── HERO ─────────────────────────────────────────────────────────── -->
    <section class="relative min-h-svh bg-neutral-950 flex flex-col overflow-hidden">
      <div class="absolute inset-0 pointer-events-none">
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-white/2.5 rounded-full blur-[140px]" />
      </div>

      <div class="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 lg:px-12 pb-20 pt-32">
        <div class="overflow-hidden mb-8">
          <p
            class="text-neutral-500 text-xs tracking-[0.3em] uppercase font-medium"
            style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both"
          >
            À PROPOS · BORDEAUX
          </p>
        </div>

        <div>
          <div v-for="(line, i) in ['Mattéo', 'DÉVELOPPEUR', 'WEB & MOBILE']" :key="line" class="overflow-hidden leading-[0.88]">
            <h1
              class="font-display font-black text-white tracking-tighter block"
              :style="`font-size: clamp(1.6rem, 6vw, 6.5rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s both`"
            >
              {{ line }}
            </h1>
          </div>
        </div>

        <div
          class="mt-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          style="animation: line-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.75s both"
        >
          <p class="text-neutral-400 leading-relaxed max-w-md text-sm md:text-base">
            Je code pour donner vie aux idées, transformer les rêves en réalités numériques.
          </p>

          <UiMagnetic>
            <NuxtLink
              to="/projets"
              class="group inline-flex items-center gap-4 text-white"
            >
              <span class="text-xs tracking-[0.25em] uppercase font-medium">Voir mes projets</span>
              <div class="size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
                <UIcon name="i-lucide-arrow-right" class="size-4 transition-colors duration-300 group-hover:text-black" />
              </div>
            </NuxtLink>
          </UiMagnetic>
        </div>
      </div>

      <div
        class="absolute bottom-8 right-12 flex flex-col items-center gap-3"
        style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 1s both"
      >
        <span class="text-[9px] tracking-[0.35em] uppercase text-neutral-600 [writing-mode:vertical-lr]">SCROLL</span>
        <div class="w-px h-14 bg-linear-to-b from-neutral-600 to-transparent" />
      </div>
    </section>

    <!-- ─── BIO ───────────────────────────────────────────────────────────── -->
    <section ref="bioEl" class="bg-neutral-50 dark:bg-neutral-950 py-16 lg:py-36">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p
          class="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium mb-16 transition-all duration-700"
          :class="bioVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        >
          Qui suis-je
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <!-- Photo -->
          <div
            class="transition-all duration-700"
            :class="bioVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          >
            <div class="aspect-4/5 rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 relative">
              <!-- Remplacer cette div par votre photo : <img src="[url de votre photo]" class="w-full h-full object-cover" alt="[Votre nom]" /> -->
              <img src="/hero.webp" class="w-full h-full object-cover" alt="Mattéo Bonneval">
            </div>
          </div>

          <!-- Texte -->
          <div class="flex flex-col gap-8">
            <div
              class="transition-all duration-700 delay-150"
              :class="bioVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            >
              <div v-for="(line, i) in ['Mattéo BONNEVAL,', 'développeur basé', 'à Bordeaux.']" :key="line" class="overflow-hidden">
                <p
                  class="font-display font-black text-neutral-950 dark:text-white tracking-tighter leading-[0.92] transition-all duration-1000 ease-out"
                  style="font-size: clamp(1.4rem, 3vw, 3rem)"
                  :class="bioVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
                  :style="{ transitionDelay: `${150 + i * 100}ms` }"
                >
                  {{ line }}
                </p>
              </div>
            </div>

            <div
              class="flex flex-col gap-6 transition-all duration-700"
              :class="bioVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
              style="transition-delay: 500ms"
            >
              <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <span class="font-semibold text-neutral-950 dark:text-white">Confinement 2020.</span> Lycéen, rien à faire, des exercices python à la pelle. Je me suis plongé dedans et
                <span class="font-semibold text-neutral-950 dark:text-white">je n'en suis jamais vraiment sorti.</span> Depuis, je construis des applications <span class="font-semibold text-neutral-950 dark:text-white">fullstack</span> en m'intéressant
                autant à l'architecture qu'à l'expérience utilisateur, parce qu'un bon produit, c'est rarement l'un
                sans l'autre.
              </p>
              <p class="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Actuellement en Master Dev Manager Fullstack à <span class="font-semibold text-neutral-950 dark:text-white">l'EFREI</span>, je mets en pratique ces compétences à travers
                des projets concrets, avec un goût prononcé pour le <span class="font-semibold text-neutral-950 dark:text-white">code propre</span>, les interfaces soignées et les systèmes
                qui tiennent dans le temps. En vacances, je suis capable de perdre le fil d'une conversation parce que
                j'ai repensé à <span class="font-semibold text-neutral-950 dark:text-white">un bug laissé en plan.</span> C'est soit de la passion, soit un problème. Je n'ai pas encore tranché.
              </p>
            </div>

            <!-- Lien CV -->
            <!-- CV button — à réactiver quand le CV sera prêt
            <div
              class="transition-all duration-700"
              :class="bioVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
              style="transition-delay: 650ms"
            >
              <a
                href="/cv.pdf"
                target="_blank"
                class="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-950 hover:border-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all duration-300"
              >
                <UIcon name="i-lucide-file-text" class="size-4" />
                Télécharger mon CV
                <UIcon name="i-lucide-download" class="size-3.5 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>
            -->
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PARCOURS ──────────────────────────────────────────────────────── -->
    <section ref="timelineEl" class="bg-neutral-950 py-16 lg:py-36">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p
          class="text-xs tracking-[0.3em] uppercase text-neutral-600 font-medium mb-16 transition-all duration-700"
          :class="timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        >
          Parcours
        </p>

        <div>
          <div
            v-for="(item, i) in parcours"
            :key="i"
            class="group py-8 border-b border-neutral-800/60 grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4 md:gap-12 transition-all duration-700"
            :class="timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="{ transitionDelay: timelineVisible ? `${i * 100}ms` : '0ms' }"
          >
            <div class="flex flex-col gap-1">
              <span class="text-xs font-mono text-neutral-600">{{ item.period }}</span>
              <span class="text-white font-display font-bold text-xl md:text-2xl tracking-tight">{{ item.role }}</span>
              <span class="text-neutral-500 text-sm">{{ item.place }}</span>
            </div>
            <p class="text-neutral-400 leading-relaxed self-center">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── VALEURS ───────────────────────────────────────────────────────── -->
    <section ref="valuesEl" class="bg-neutral-50 dark:bg-neutral-950 py-16 lg:py-36">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          class="flex items-baseline justify-between mb-16 transition-all duration-700"
          :class="valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
        >
          <p class="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">Comment je travaille</p>
          <span class="text-xs font-mono text-neutral-400">{{ String(valeurs.length).padStart(2, '0') }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="(v, i) in valeurs"
            :key="i"
            class="group relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-8 lg:p-10 will-change-transform"
            :class="valuesVisible ? 'opacity-100' : 'opacity-0 translate-y-8'"
            :style="tiltCardStyle(i, valuesVisible, i)"
            @mousemove="(e) => onMouseMove(e, i)"
            @mouseleave="onMouseLeave(i)"
          >
            <!-- Border glow on hover -->
            <div
              class="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style="box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);"
            />
            <span class="relative z-10 text-xs font-mono text-neutral-400 dark:text-neutral-600 mb-6 block">{{ v.index }}</span>
            <h3 class="relative z-10 font-display font-bold text-xl md:text-2xl text-neutral-950 dark:text-white tracking-tight mb-4">
              {{ v.title }}
            </h3>
            <p class="relative z-10 text-neutral-500 leading-relaxed text-sm md:text-base">
              {{ v.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CTA ───────────────────────────────────────────────────────────── -->
    <section ref="ctaEl" class="bg-neutral-950 py-16 lg:py-36">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <p
              class="text-xs tracking-[0.3em] uppercase text-neutral-600 font-medium mb-8 transition-all duration-700"
              :class="ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
            >
              Travaillons ensemble
            </p>
            <div v-for="(line, i) in ['Vous avez un', 'projet en tête ?']" :key="line" class="overflow-hidden">
              <h2
                class="font-display font-black text-white tracking-tighter leading-[0.92] transition-all duration-1000 ease-out"
                style="font-size: clamp(2rem, 5vw, 6rem)"
                :class="ctaVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
                :style="{ transitionDelay: `${i * 120}ms` }"
              >
                {{ line }}
              </h2>
            </div>
          </div>

          <div
            class="flex flex-col gap-4 transition-all duration-700"
            :class="ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
            style="transition-delay: 300ms"
          >
            <p class="text-neutral-500 leading-relaxed max-w-sm">
              N'hésitez pas à me contacter pour discuter de votre projet. Je réponds en général sous 24h.
            </p>
            <div class="flex flex-wrap gap-3 mt-4">
              <NuxtLink
                to="/#contact"
                class="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-colors duration-300"
              >
                Me contacter
                <UIcon name="i-lucide-arrow-right" class="size-3.5 group-hover:translate-x-1 transition-transform" />
              </NuxtLink>
              <NuxtLink
                to="/projets"
                class="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-white hover:border-white hover:text-black transition-all duration-300"
              >
                Voir mes projets
                <UIcon name="i-lucide-arrow-up-right" class="size-3.5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
