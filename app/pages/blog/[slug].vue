<script setup lang="ts">
import type { Post } from '~~/server/db/schema'

const route = useRoute()
const { data: post, error } = await useFetch<Post>(`/api/blog/${route.params.slug}`)

if (error.value || !post.value) {
  throw createError({ statusCode: 404, message: 'Article introuvable' })
}

onMounted(() => {
  $fetch(`/api/blog/${route.params.slug}/view`, { method: 'POST' }).catch(() => {})
})

const readingTime = computed(() => {
  if (!post.value?.content) return 1
  const words = post.value.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
})

const { el: contentEl, isVisible: contentVisible } = useReveal({ threshold: 0.05 })

useSeoMeta({
  title: () => post.value?.metaTitle || post.value?.title || '',
  description: () => post.value?.metaDescription || post.value?.excerpt || undefined,
  ogImage: () => post.value?.coverImage ? coverImageSrc(post.value.coverImage) ?? undefined : undefined,
})
</script>

<template>
  <article v-if="post">
    <!-- Hero -->
    <section class="bg-neutral-950 overflow-hidden pt-24">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12 pt-12 pb-14">
        <!-- Tags -->
        <div class="overflow-hidden mb-6">
          <div
            class="flex flex-wrap items-center gap-4"
            style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both"
          >
            <span
              v-for="tag in parseTags(post.tags).slice(0, 3)"
              :key="tag"
              class="text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-medium"
            >{{ tag }}</span>
          </div>
        </div>

        <!-- Title -->
        <div class="overflow-hidden leading-[0.9] mb-10">
          <h1
            class="font-display font-black text-white tracking-tighter"
            style="font-size: clamp(2.5rem, 7vw, 7rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both"
          >
            {{ post.title }}
          </h1>
        </div>

        <!-- Meta -->
        <div
          class="flex flex-wrap items-center gap-4 text-sm text-neutral-500"
          style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both"
        >
          <span>{{ post.publishedAt ? formatDate(new Date(post.publishedAt)) : '' }}</span>
          <span class="text-neutral-700">·</span>
          <span>{{ readingTime }} min de lecture</span>
        </div>
      </div>

      <!-- Cover -->
      <div
        v-if="post.coverImage"
        class="w-full max-h-[65vh] overflow-hidden"
        style="animation: line-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both"
      >
        <img
          :src="coverImageSrc(post.coverImage)!"
          :alt="post.title"
          class="w-full h-full object-cover"
        />
      </div>
    </section>

    <!-- Article body -->
    <section ref="contentEl" class="bg-white dark:bg-neutral-950 py-16 lg:py-24">
      <div
        class="max-w-2xl mx-auto px-6 lg:px-0 transition-all duration-700"
        :class="contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
      >
        <p
          v-if="post.excerpt"
          class="text-xl leading-relaxed text-neutral-600 dark:text-neutral-300 font-medium mb-12 border-l-2 border-neutral-300 dark:border-neutral-700 pl-6"
        >
          {{ post.excerpt }}
        </p>
        <div class="blog-content" v-html="post.content" />
      </div>
    </section>

    <!-- Back -->
    <div class="bg-white dark:bg-neutral-950 py-10 border-t border-neutral-100 dark:border-neutral-800/60">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12">
        <NuxtLink
          to="/blog"
          class="group inline-flex items-center gap-2.5 text-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4 group-hover:-translate-x-1 transition-transform" />
          Retour au journal
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
