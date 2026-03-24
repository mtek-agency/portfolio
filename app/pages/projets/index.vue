<script setup lang="ts">
type PublicProject = {
  id: number
  name: string
  slug: string
  description: string
  year: string
  tags: string | null
  images: { id: number; url: string }[]
}

const { data: projects } = await useFetch<PublicProject[]>('/api/projects/public')

const { el: gridEl, isVisible: gridVisible } = useReveal({ threshold: 0.05 })

useSeoMeta({
  title: 'Projets',
  description: 'Sélection de projets web & mobile réalisés lors de projets étudiants, personnels ou professionnels.',
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="bg-neutral-950 min-h-[55vh] flex flex-col justify-end pb-0 overflow-hidden">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12 pb-14 w-full pt-32">
        <div class="overflow-hidden mb-4">
          <p
            class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
            style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both"
          >
            {{ projects?.length ?? 0 }} projets
          </p>
        </div>
        <div class="overflow-hidden leading-[0.88]">
          <h1
            class="font-display font-black text-white tracking-tighter"
            style="font-size: clamp(4rem, 13vw, 13rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both"
          >
            Projets.
          </h1>
        </div>
      </div>
    </section>

    <!-- Grid -->
    <section ref="gridEl" class="bg-white dark:bg-neutral-950 py-20 lg:py-28">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          <NuxtLink
            v-for="(project, i) in projects"
            :key="project.id"
            :to="`/projets/${project.slug}`"
            class="group block transition-all duration-700"
            :class="gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'"
            :style="{ transitionDelay: gridVisible ? `${i * 70}ms` : '0ms' }"
          >
            <!-- Image -->
            <div class="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-6 relative">
              <img
                v-if="project.images[0]"
                :src="coverImageSrc(project.images[0].url)!"
                :alt="project.name"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-800 dark:to-neutral-700" />
              <div class="absolute top-4 right-4">
                <span class="text-xs font-mono text-white bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">{{ project.year }}</span>
              </div>
            </div>

            <!-- Info -->
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1 min-w-0">
                <h2 class="font-display font-bold text-xl text-neutral-900 dark:text-white mb-3 group-hover:underline underline-offset-4 decoration-1 truncate">
                  {{ project.name }}
                </h2>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in parseTags(project.tags).slice(0, 3)"
                    :key="tag"
                    class="text-xs px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
                  >{{ tag }}</span>
                </div>
              </div>
              <div class="size-9 shrink-0 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-950 group-hover:border-neutral-950 dark:group-hover:bg-white dark:group-hover:border-white mt-0.5">
                <UIcon name="i-lucide-arrow-up-right" class="size-4 text-neutral-400 group-hover:text-white dark:group-hover:text-black transition-colors" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
