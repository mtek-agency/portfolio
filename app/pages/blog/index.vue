<script setup lang="ts">
import type { Post } from '#shared/types/studio'

const { data: posts } = await useFetch<Post[]>('/api/blog')

onMounted(() => {
  document.documentElement.style.scrollSnapType = 'y mandatory'
  const footer = document.querySelector('footer') as HTMLElement | null
  if (footer) {
    footer.style.scrollSnapAlign = 'start'
    footer.style.minHeight = '100svh'
  }
})
onUnmounted(() => {
  document.documentElement.style.scrollSnapType = ''
  const footer = document.querySelector('footer') as HTMLElement | null
  if (footer) {
    footer.style.scrollSnapAlign = ''
    footer.style.minHeight = ''
  }
})

useSeoMeta({
  title: 'Journal',
  description: 'Articles sur le développement web, mobile et les nouvelles technologies.',
  twitterCard: 'summary_large_image',
  ogLocale: 'fr_FR',
})

defineOgImage('Portfolio', {
  title: 'Journal',
  description: 'Articles sur le développement web, mobile et les nouvelles technologies.',
  label: 'Blog',
})

useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: 'Journal — Mattéo Bonneval',
    description: 'Articles sur le développement web, mobile et les nouvelles technologies.',
    url: 'https://matteo-bonneval.fr/blog',
  }),
])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="h-svh bg-neutral-950 flex flex-col justify-end overflow-hidden relative" style="scroll-snap-align: start">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 pb-28 w-full pt-32">
        <div class="overflow-hidden mb-4">
          <p
            class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
            style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both"
          >
            {{ posts?.length ?? 0 }} article{{ (posts?.length ?? 0) > 1 ? 's' : '' }}
          </p>
        </div>
        <div class="overflow-hidden leading-[0.88]">
          <h1
            class="font-display font-black text-white tracking-tighter"
            style="font-size: clamp(2.6rem, 13vw, 13rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both"
          >
            Journal.
          </h1>
        </div>
      </div>
      <div
        class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
        style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.6s both"
      >
        <span class="text-[9px] uppercase tracking-[0.4em]">Scroll</span>
        <UIcon name="i-lucide-chevron-down" class="size-4 animate-bounce" />
      </div>
    </section>

    <!-- Article slides -->
    <div
      v-for="(post, i) in posts"
      :key="post.id"
      class="snap-start min-h-svh py-24 relative flex items-center overflow-hidden"
      style="scroll-snap-align: start"
    >
        <!-- Atmospheric background -->
        <div class="absolute inset-0">
          <NuxtImg
            v-if="post.coverImage"
            :src="coverImageSrc(post.coverImage)!"
            :alt="post.title"
            width="1200"
            quality="40"
            class="w-full h-full object-cover"
            style="filter: blur(28px) saturate(1.3); transform: scale(1.12)"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-neutral-950/75" />
          <div class="absolute inset-0" style="background: radial-gradient(ellipse at center, transparent 30%, rgba(10,10,10,0.55) 100%)" />
        </div>

        <!-- Content -->
        <div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div class="max-w-3xl">
            <div class="flex items-center gap-4 mb-8">
              <span class="text-[10px] font-mono text-white/30">{{ String(i + 1).padStart(2, '0') }}</span>
              <span v-if="post.isFeatured" class="text-[10px] px-3 py-1 bg-white text-black rounded-full font-semibold tracking-[0.2em] uppercase">À la une</span>
              <span v-if="parseTags(post.tags)[0]" class="text-[10px] uppercase tracking-[0.35em] text-white/40 font-medium">
                {{ parseTags(post.tags)[0] }}
              </span>
            </div>

            <h2
              class="font-display font-black text-white tracking-tighter leading-[0.9] mb-8"
              style="font-size: clamp(2.8rem, 7vw, 8rem)"
            >
              {{ post.title }}
            </h2>

            <p v-if="post.excerpt" class="text-white/55 text-lg leading-relaxed max-w-2xl mb-10">
              {{ post.excerpt }}
            </p>

            <div class="flex items-center gap-6">
              <NuxtLink
                :to="`/blog/${post.slug}`"
                class="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors duration-300"
              >
                Lire l'article
                <UIcon name="i-lucide-arrow-up-right" class="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </NuxtLink>
              <span class="text-xs text-white/30 font-mono">
                {{ post.publishedAt ? formatDate(new Date(post.publishedAt), { dateStyle: 'long' }) : '' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Slide counter -->
        <div class="absolute bottom-10 right-6 lg:right-12 flex items-center gap-2 text-white/20">
          <span class="text-[10px] font-mono">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="text-[10px] font-mono">/</span>
          <span class="text-[10px] font-mono">{{ String(posts?.length ?? 0).padStart(2, '0') }}</span>
        </div>

        <!-- Next indicator -->
        <div
          v-if="i < (posts?.length ?? 0) - 1"
          class="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
        >
          <UIcon name="i-lucide-chevron-down" class="size-4 animate-bounce" />
        </div>
      </div>
  </div>
</template>
