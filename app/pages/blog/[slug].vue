<script setup lang="ts">
import type { Post } from '~~/server/db/schema'

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useFetch<Post>(`/api/blog/${slug}`, {
  key: `blog-${slug}`,
})

if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Article introuvable' })

useSeoMeta({
  title: post.value.metaTitle || post.value.title,
  ogTitle: post.value.metaTitle || post.value.title,
  description: post.value.metaDescription || post.value.excerpt || undefined,
  ogDescription: post.value.metaDescription || post.value.excerpt || undefined,
  ogImage: post.value.coverImage ? coverImageSrc(post.value.coverImage) ?? undefined : undefined,
})

const tags = computed(() => parseTags(post.value?.tags))

onMounted(() => {
  $fetch(`/api/blog/${slug}/view`, { method: 'POST' }).catch(() => {})
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-16">
    <!-- Back -->
    <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm text-muted hover:text-default transition-colors mb-8">
      <UIcon name="i-lucide-arrow-left" class="size-4" />
      Retour au blog
    </NuxtLink>

    <!-- Cover image -->
    <img
      v-if="post?.coverImage"
      :src="coverImageSrc(post.coverImage)!"
      :alt="post.title"
      class="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
    >

    <!-- Tags -->
    <div v-if="tags.length" class="flex flex-wrap gap-2 mb-4">
      <UBadge
        v-for="tag in tags"
        :key="tag"
        :label="tag"
        color="neutral"
        variant="outline"
        size="sm"
      />
    </div>

    <!-- Title -->
    <h1 class="text-4xl font-bold text-highlighted mb-4">{{ post?.title }}</h1>

    <!-- Meta -->
    <div class="flex items-center gap-3 text-sm text-muted mb-10">
      <span v-if="post?.publishedAt">{{ formatDate(post.publishedAt) }}</span>
    </div>

    <USeparator class="mb-10" />

    <!-- Content -->
    <div class="blog-content" v-html="post?.content" />
  </div>
</template>
