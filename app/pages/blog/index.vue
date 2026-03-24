<script setup lang="ts">
import type { Post } from '~~/server/db/schema'

const { data: posts } = await useFetch<Post[]>('/api/blog')

const featured = computed(() => posts.value?.find(p => p.isFeatured) ?? posts.value?.[0] ?? null)
const rest = computed(() => posts.value?.filter(p => p.id !== featured.value?.id) ?? [])

const { el: gridEl, isVisible: gridVisible } = useReveal({ threshold: 0.05 })

useSeoMeta({
  title: 'Blog',
  description: 'Articles sur le développement web, mobile et les nouvelles technologies.',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-neutral-950 min-h-[50vh] flex flex-col justify-end overflow-hidden">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12 pb-14 w-full pt-32">
        <div class="overflow-hidden mb-4">
          <p
            class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
            style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both"
          >
            {{ posts?.length ?? 0 }} articles
          </p>
        </div>
        <div class="overflow-hidden leading-[0.88]">
          <h1
            class="font-display font-black text-white tracking-tighter"
            style="font-size: clamp(4rem, 13vw, 13rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both"
          >
            Journal.
          </h1>
        </div>
      </div>
    </section>

    <div class="bg-white dark:bg-neutral-950">
      <!-- Featured post -->
      <div v-if="featured" class="max-w-screen-xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <NuxtLink
          :to="`/blog/${featured.slug}`"
          class="group grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center"
        >
          <div class="lg:col-span-3 aspect-[16/10] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <img
              v-if="featured.coverImage"
              :src="coverImageSrc(featured.coverImage)!"
              :alt="featured.title"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-800" />
          </div>

          <div class="lg:col-span-2">
            <div class="flex flex-wrap items-center gap-3 mb-6">
              <span class="text-[10px] px-3 py-1 bg-neutral-950 dark:bg-white text-white dark:text-black rounded-full font-semibold tracking-[0.2em] uppercase">À la une</span>
              <span v-if="parseTags(featured.tags)[0]" class="text-[10px] tracking-[0.3em] uppercase text-neutral-400 font-medium">
                {{ parseTags(featured.tags)[0] }}
              </span>
            </div>
            <h2 class="font-display font-bold text-2xl md:text-3xl lg:text-4xl text-neutral-950 dark:text-white leading-tight tracking-tight mb-5 group-hover:underline underline-offset-4 decoration-1">
              {{ featured.title }}
            </h2>
            <p v-if="featured.excerpt" class="text-neutral-500 leading-relaxed mb-6 line-clamp-3">{{ featured.excerpt }}</p>
            <p class="text-xs text-neutral-400">
              {{ featured.publishedAt ? formatDate(new Date(featured.publishedAt)) : '' }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Divider -->
      <div v-if="rest.length" class="border-t border-neutral-100 dark:border-neutral-800/60" />

      <!-- Grid -->
      <div ref="gridEl" class="max-w-screen-xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          <NuxtLink
            v-for="(post, i) in rest"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            class="group block transition-all duration-700"
            :class="gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
            :style="{ transitionDelay: gridVisible ? `${i * 75}ms` : '0ms' }"
          >
            <div class="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-5">
              <img
                v-if="post.coverImage"
                :src="coverImageSrc(post.coverImage)!"
                :alt="post.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700" />
            </div>
            <div class="flex items-center gap-3 mb-3">
              <span v-if="parseTags(post.tags)[0]" class="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-medium">
                {{ parseTags(post.tags)[0] }}
              </span>
              <span class="text-neutral-300 dark:text-neutral-700">·</span>
              <span class="text-xs text-neutral-400">{{ post.publishedAt ? formatDateShort(new Date(post.publishedAt)) : '' }}</span>
            </div>
            <h3 class="font-semibold text-neutral-900 dark:text-white leading-snug group-hover:underline underline-offset-2 decoration-1 line-clamp-2">
              {{ post.title }}
            </h3>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
