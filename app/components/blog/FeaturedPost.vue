<script setup lang="ts">
import type { Post } from '~~/server/db/schema'

defineProps<{ post: Post }>()
</script>

<template>
  <NuxtLink
    :to="`/blog/${post.slug}`"
    class="group block max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24"
  >
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">
      <!-- Image -->
      <div class="lg:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img
          v-if="post.coverImage"
          :src="coverImageSrc(post.coverImage)!"
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
      </div>

      <!-- Content -->
      <div class="lg:col-span-2 lg:pt-4">
        <div class="flex flex-wrap items-center gap-3 mb-6">
          <span class="text-[10px] px-3 py-1 bg-neutral-950 dark:bg-white text-white dark:text-black rounded-full font-semibold tracking-[0.2em] uppercase">À la une</span>
          <span v-if="parseTags(post.tags)[0]" class="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
            {{ parseTags(post.tags)[0] }}
          </span>
        </div>
        <h2 class="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-neutral-950 dark:text-white leading-tight tracking-tight mb-5 group-hover:underline underline-offset-4 decoration-1">
          {{ post.title }}
        </h2>
        <p v-if="post.excerpt" class="text-neutral-500 leading-relaxed mb-8 line-clamp-3">
          {{ post.excerpt }}
        </p>
        <div class="flex items-center justify-between">
          <p class="text-xs text-neutral-400">
            {{ post.publishedAt ? formatDate(new Date(post.publishedAt)) : '' }}
          </p>
          <span class="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase font-medium text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200">
            Lire l'article
            <UIcon name="i-lucide-arrow-up-right" class="size-3" />
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
