<script setup lang="ts">
import type { Project, ProjectImage } from '~~/server/db/schema'

type ProjectWithImages = Project & {
  images: ProjectImage[]
  views: number
}

const route = useRoute()
const { data: project, error } = await useFetch<ProjectWithImages>(`/api/projects/${route.params.slug}`)

if (error.value || !project.value) {
  throw createError({ statusCode: 404, message: 'Projet introuvable' })
}

onMounted(() => {
  $fetch(`/api/projects/${route.params.slug}/view`, { method: 'POST' }).catch(() => {})
})

const coverImage = computed(() =>
  project.value?.images[0] ? coverImageSrc(project.value.images[0].url) : null,
)
const techStack = computed(() => parseTags(project.value?.stack))
const tags = computed(() => parseTags(project.value?.tags))

const { el: contentEl, isVisible: contentVisible } = useReveal({ threshold: 0.05 })
const { el: galleryEl, isVisible: galleryVisible } = useReveal({ threshold: 0.05 })

useSeoMeta({
  title: () => project.value?.metaTitle || project.value?.name || '',
  description: () => project.value?.metaDescription || project.value?.description || '',
  ogImage: () => coverImage.value ?? undefined,
})
</script>

<template>
  <div v-if="project">
    <!-- Hero -->
    <section class="bg-neutral-950 overflow-hidden pt-24">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12 pt-12 pb-14">
        <div class="flex flex-col lg:flex-row items-start justify-between gap-10">
          <div class="flex-1">
            <div class="overflow-hidden mb-5">
              <p
                class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
                style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both"
              >
                {{ project.year }}
              </p>
            </div>
            <div class="overflow-hidden leading-[0.88]">
              <h1
                class="font-display font-black text-white tracking-tighter"
                style="font-size: clamp(3rem, 9vw, 9rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both"
              >
                {{ project.name }}
              </h1>
            </div>
          </div>

          <div
            class="lg:pt-6 shrink-0 flex flex-row lg:flex-col gap-3"
            style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.4s both"
          >
            <a
              v-if="project.urlWebsite"
              :href="project.urlWebsite"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition-colors duration-300"
            >
              Visiter le site
              <UIcon name="i-lucide-arrow-up-right" class="size-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              v-if="project.urlRepository"
              :href="project.urlRepository"
              target="_blank"
              rel="noopener noreferrer"
              class="group inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-colors duration-300"
            >
              Code source
              <UIcon name="i-lucide-github" class="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Cover image -->
      <div v-if="coverImage" class="w-full aspect-[21/9] overflow-hidden" style="animation: line-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both">
        <img :src="coverImage" :alt="project.name" class="w-full h-full object-cover" />
      </div>
    </section>

    <!-- Content -->
    <section ref="contentEl" class="bg-white dark:bg-neutral-950 py-20 lg:py-28">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12">
        <div
          class="grid grid-cols-1 lg:grid-cols-3 gap-16 transition-all duration-700"
          :class="contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <!-- Description -->
          <div class="lg:col-span-2">
            <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium mb-6">À propos</p>
            <p class="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
              {{ project.description }}
            </p>
          </div>

          <!-- Sidebar meta -->
          <div class="flex flex-col gap-10">
            <div v-if="tags.length">
              <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium mb-4">Tags</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in tags"
                  :key="tag"
                  class="text-sm px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400"
                >{{ tag }}</span>
              </div>
            </div>

            <div v-if="techStack.length">
              <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium mb-4">Stack</p>
              <div class="flex flex-col gap-2.5">
                <span
                  v-for="tech in techStack"
                  :key="tech"
                  class="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >{{ tech }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section
      v-if="project.images.length > 1"
      ref="galleryEl"
      class="bg-neutral-50 dark:bg-neutral-900 py-16 lg:py-24"
    >
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12">
        <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium mb-10">Galerie</p>
        <div
          class="columns-1 md:columns-2 gap-4 space-y-4 transition-all duration-700"
          :class="galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <div
            v-for="(image, i) in project.images.slice(1)"
            :key="image.id"
            class="break-inside-avoid rounded-2xl overflow-hidden transition-all duration-700"
            :class="galleryVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
            :style="{ transitionDelay: galleryVisible ? `${i * 80}ms` : '0ms' }"
          >
            <img :src="coverImageSrc(image.url)!" :alt="project.name" class="w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- Back -->
    <div class="bg-white dark:bg-neutral-950 py-10 border-t border-neutral-100 dark:border-neutral-800/60">
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12">
        <NuxtLink
          to="/projets"
          class="group inline-flex items-center gap-2.5 text-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
        >
          <UIcon name="i-lucide-arrow-left" class="size-4 group-hover:-translate-x-1 transition-transform" />
          Tous les projets
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
