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
})

defineOgImage({
  component: 'Portfolio',
  title: 'Projets',
  description: 'Sélection de projets web & mobile.',
  label: 'Portfolio',
})
</script>

<template>
  <div class="bg-neutral-50 dark:bg-neutral-950">
    <ProjetsHero :count="projects.length" />

    <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-20 lg:pt-28">
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
