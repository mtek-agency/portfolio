<script setup lang="ts">
import type { Post } from '~~/server/db/schema'

defineProps<{ posts: Post[] }>()

const { el, isVisible } = useReveal()
</script>

<template>
  <section ref="el" class="bg-neutral-100 dark:bg-neutral-950 py-24 lg:py-36">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <!-- Header -->
      <div
        class="flex items-center justify-between mb-12 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-500 dark:text-neutral-600 font-medium">Journal</p>
        <NuxtLink
          to="/blog"
          class="group inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-500 dark:text-neutral-600 hover:text-neutral-950 dark:hover:text-white transition-colors duration-200"
        >
          Tout lire
          <UIcon name="i-lucide-arrow-right" class="size-3 group-hover:translate-x-1 transition-transform" />
        </NuxtLink>
      </div>

      <!-- Featured post -->
      <NuxtLink
        v-if="posts[0]"
        :to="`/blog/${posts[0].slug}`"
        class="group relative block w-full rounded-3xl overflow-hidden mb-4 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
      >
        <div class="aspect-[4/3] md:aspect-[16/7] w-full overflow-hidden bg-neutral-900">
          <NuxtImg
            v-if="posts[0].coverImage"
            :src="coverImageSrc(posts[0].coverImage)!"
            :alt="posts[0].title"
            sizes="100vw"
            class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
        <div class="absolute bottom-0 left-0 right-0 p-5 md:p-8 lg:p-12">
          <div class="flex items-center gap-3 mb-4">
            <span v-if="parseTags(posts[0].tags)[0]" class="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-medium">
              {{ parseTags(posts[0].tags)[0] }}
            </span>
            <span class="text-neutral-700">·</span>
            <span class="text-xs text-neutral-400">{{ posts[0].publishedAt ? formatDate(new Date(posts[0].publishedAt), { day: 'numeric', month: 'short', year: 'numeric' }) : '' }}</span>
          </div>
          <h2
            class="font-display font-black text-white tracking-tighter leading-[0.92] transition-transform duration-500 group-hover:translate-x-2"
            style="font-size: clamp(1.6rem, 3.5vw, 3.5rem)"
          >
            {{ posts[0].title }}
          </h2>
          <div class="mt-5 inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-400 group-hover:text-white transition-colors duration-300">
            Lire l'article
            <UIcon name="i-lucide-arrow-right" class="size-3 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </NuxtLink>

      <!-- Secondary posts -->
      <div v-if="posts.length > 1" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NuxtLink
          v-for="(post, i) in posts.slice(1)"
          :key="post.id"
          :to="`/blog/${post.slug}`"
          class="group relative block rounded-2xl overflow-hidden transition-all duration-700"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'"
          :style="{ transitionDelay: isVisible ? `${(i + 1) * 100}ms` : '0ms' }"
        >
          <div class="aspect-[16/9] w-full overflow-hidden bg-neutral-900">
            <NuxtImg
              v-if="post.coverImage"
              :src="coverImageSrc(post.coverImage)!"
              :alt="post.title"
              sizes="sm:100vw md:50vw"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900" />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <div class="flex items-center gap-3 mb-2">
              <span v-if="parseTags(post.tags)[0]" class="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-medium">
                {{ parseTags(post.tags)[0] }}
              </span>
              <span class="text-neutral-700">·</span>
              <span class="text-xs text-neutral-500">{{ post.publishedAt ? formatDate(new Date(post.publishedAt), { day: 'numeric', month: 'short', year: 'numeric' }) : '' }}</span>
            </div>
            <h3
              class="font-display font-bold text-white tracking-tight leading-snug transition-transform duration-500 group-hover:translate-x-1.5"
              style="font-size: clamp(1rem, 1.8vw, 1.4rem)"
            >
              {{ post.title }}
            </h3>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
