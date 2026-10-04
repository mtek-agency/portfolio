<script setup lang="ts">
import type { PublicProject } from '#shared/types/studio'

defineProps<{ project: PublicProject }>()
</script>

<template>
  <NuxtLink
    :to="`/projets/${project.slug}`"
    class="group flex flex-col md:flex-row rounded-2xl lg:rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors duration-300 md:h-[calc(100svh-172px)]"
  >
    <!-- Cover image -->
    <div class="md:w-2/5 lg:w-1/2 aspect-[16/10] md:aspect-auto md:h-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
      <NuxtImg
        v-if="project.images[0]"
        :src="coverImageSrc(project.images[0].url)!"
        :alt="project.name"
        sizes="sm:100vw md:40vw lg:50vw"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-linear-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900" />
    </div>

    <!-- Content -->
    <div class="flex flex-col justify-between flex-1 p-6 lg:p-8">
      <div>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-xs font-mono text-neutral-400 dark:text-neutral-600">{{ project.year }}</span>
          <span class="text-neutral-200 dark:text-neutral-800">·</span>
          <div class="flex gap-1.5 flex-wrap">
            <span
              v-for="tag in parseTags(project.tags).slice(0, 3)"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
            >{{ tag }}</span>
          </div>
        </div>
        <h2 class="font-display font-bold text-xl lg:text-2xl text-neutral-950 dark:text-white tracking-tight leading-snug mb-3 group-hover:translate-x-1 transition-transform duration-300">
          {{ project.name }}
        </h2>
        <p v-if="project.description" class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {{ project.description }}
        </p>
      </div>

      <div class="flex items-center justify-between pt-5 border-t border-neutral-100 dark:border-neutral-800">
        <span class="text-xs tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-600 font-medium">Voir le projet</span>
        <div class="size-9 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-950 group-hover:border-neutral-950 dark:group-hover:bg-white dark:group-hover:border-white">
          <UIcon name="i-lucide-arrow-up-right" class="size-4 text-neutral-400 group-hover:text-white dark:group-hover:text-black transition-colors" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
