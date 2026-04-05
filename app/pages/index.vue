<script setup lang="ts">
import type { Post, Tool } from '~~/server/db/schema'
import type { PublicProject } from '~/types/home'

const [{ data: projects }, { data: posts }, { data: tools }] = await Promise.all([
  useFetch<PublicProject[]>('/api/projects/public'),
  useFetch<Post[]>('/api/blog'),
  useFetch<Tool[]>('/api/tools/public'),
])

const featuredProjects = computed(() => (projects.value ?? []).slice(0, 5))
const recentPosts = computed(() => (posts.value ?? []).slice(0, 3))

useSeoMeta({
  title: 'Mattéo Bonneval — Développeur Web & Mobile',
  titleTemplate: '%s',
  description: 'Développeur web & mobile basé à Bordeaux. Je transforme vos idées en solutions numériques.',
  twitterCard: 'summary_large_image',
  ogLocale: 'fr_FR',
})

defineOgImage({
  component: 'Portfolio',
  title: 'Mattéo Bonneval',
  description: 'Développeur Web & Mobile basé à Bordeaux.',
})

useSchemaOrg([
  defineWebSite({ name: 'Mattéo Bonneval' }),
  definePerson({
    name: 'Mattéo Bonneval',
    url: 'https://matteo-bonneval.fr',
    image: 'https://matteo-bonneval.fr/hero.webp',
    sameAs: [
      'https://www.linkedin.com/in/matteo-bonneval',
      'https://github.com/matteobnvl',
    ],
    jobTitle: 'Développeur Web & Mobile',
    description: 'Développeur web & mobile basé à Bordeaux, spécialisé en applications fullstack.',
  }),
])
</script>

<template>
  <div>
    <HomeHero />
    <UiStackReveal />
    <HomeWorks :projects="featuredProjects" />
    <HomeStatement />
    <HomeTools v-if="tools?.length" :tools="tools" />
    <HomeJournal v-if="recentPosts.length" :posts="recentPosts" />
    <HomeContact />
  </div>
</template>
