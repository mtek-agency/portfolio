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
})
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
