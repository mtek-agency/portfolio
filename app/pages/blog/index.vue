<script setup lang="ts">
import type { Post } from '~~/server/db/schema'

useSeoMeta({ title: 'Blog' })

const { data: posts } = await useFetch<Post[]>('/api/blog', { key: 'blog' })

const featured = computed(() => posts.value?.filter(p => p.isFeatured) ?? [])
const rest = computed(() => posts.value?.filter(p => !p.isFeatured) ?? [])
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-highlighted mb-2">Blog</h1>
    <p class="text-muted mb-12">Mes articles, pensées et retours d'expérience.</p>

    <!-- Featured posts -->
    <section v-if="featured.length" class="mb-12">
      <h2 class="text-xs font-semibold text-muted uppercase tracking-wider mb-6">À la une</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <NuxtLink
          v-for="post in featured"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group rounded-2xl border border-default bg-elevated/40 overflow-hidden hover:border-accented transition-colors"
        >
          <img v-if="post.coverImage" :src="coverImageSrc(post.coverImage)!" :alt="post.title" class="w-full h-48 object-cover">
          <div class="p-5">
            <div class="flex flex-wrap gap-1 mb-3">
              <UBadge
                v-for="tag in parseTags(post.tags)"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="outline"
                size="xs"
              />
            </div>
            <h3 class="font-semibold text-lg text-highlighted group-hover:text-primary transition-colors mb-2">
              {{ post.title }}
            </h3>
            <p v-if="post.excerpt" class="text-sm text-muted line-clamp-2">{{ post.excerpt }}</p>
            <p class="text-xs text-muted mt-3">{{ post.publishedAt ? formatDateShort(post.publishedAt) : '' }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- All posts -->
    <section v-if="rest.length">
      <h2 v-if="featured.length" class="text-xs font-semibold text-muted uppercase tracking-wider mb-6">Tous les articles</h2>
      <div class="flex flex-col divide-y divide-default">
        <NuxtLink
          v-for="post in rest"
          :key="post.slug"
          :to="`/blog/${post.slug}`"
          class="group py-5 flex gap-4 items-start hover:text-primary transition-colors"
        >
          <img v-if="post.coverImage" :src="coverImageSrc(post.coverImage)!" :alt="post.title" class="size-16 rounded-lg object-cover shrink-0">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap gap-1 mb-1.5">
              <UBadge
                v-for="tag in parseTags(post.tags)"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="outline"
                size="xs"
              />
            </div>
            <p class="font-medium text-highlighted group-hover:text-primary transition-colors">{{ post.title }}</p>
            <p v-if="post.excerpt" class="text-sm text-muted mt-1 line-clamp-1">{{ post.excerpt }}</p>
          </div>
          <p class="text-xs text-muted shrink-0 mt-0.5">{{ post.publishedAt ? formatDateShort(post.publishedAt) : '' }}</p>
        </NuxtLink>
      </div>
    </section>

    <div v-if="!posts?.length" class="text-center py-20 text-muted">
      Aucun article publié pour l'instant.
    </div>
  </div>
</template>
