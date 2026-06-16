<script setup lang="ts">
import type { PublicProject } from '~/types/home'

const { data } = await useFetch<PublicProject[]>('/api/projects/public')
const projects = computed(() => data.value ?? [])

const byYear = computed(() => {
  const groups: Record<string, PublicProject[]> = {}
  for (const p of projects.value) {
    ;(groups[p.year] ??= []).push(p)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
})

const projectItems = computed(() =>
  projects.value.map((project, index) => ({ project, index })),
)

const { cardEls, cardStyle } = useStackCards(computed(() => projects.value.length))

useSeoMeta({
  title: 'Projets — Mattéo Bonneval',
  description: 'Sélection de projets web & mobile réalisés lors de projets étudiants, personnels ou professionnels.',
  twitterCard: 'summary_large_image',
  ogLocale: 'fr_FR',
})

defineOgImage('Portfolio', {
  title: 'Projets',
  description: 'Sélection de projets web & mobile.',
  label: 'Portfolio',
})

useSchemaOrg([
  defineItemList({
    name: 'Projets de Mattéo Bonneval',
    itemListElement: () => projects.value.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.name,
      url: `https://matteo-bonneval.fr/projets/${project.slug}`,
    })),
  }),
])
</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-950">
    <ProjetsHero :count="projects.length" />

    <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
      <!-- Mobile year strip -->
      <div class="md:hidden flex gap-2 overflow-x-auto pb-3 mb-6 -mx-6 px-6 scrollbar-none">
        <div
          v-for="[year, yearProjects] in byYear"
          :key="year"
          class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800"
        >
          <span class="text-xs font-mono font-semibold text-neutral-900 dark:text-white">{{ year }}</span>
          <span class="text-xs font-mono text-neutral-400 dark:text-neutral-600">{{ yearProjects.length.toString().padStart(2, '0') }}</span>
        </div>
      </div>

      <div class="flex gap-8 lg:gap-14">
        <ProjetsTimeline :by-year="byYear" />

        <!-- Stacking cards -->
        <div class="flex-1 min-w-0">
          <div
            v-for="{ project, index } in projectItems"
            :key="project.id"
            :ref="el => { cardEls[index] = el as HTMLElement }"
            class="mb-3 will-change-transform"
            :style="cardStyle(index)"
          >
            <ProjetsCard :project="project" />
          </div>
          <div class="h-svh" />
        </div>
      </div>
    </div>
  </div>
</template>
