<script setup lang="ts">
import type { Project, ProjectImage } from '~~/server/db/schema'
import type { PublicProject } from '~/types/home'

type ProjectWithImages = Project & {
  images: ProjectImage[]
  views: number
}

const route = useRoute()

const [{ data: project, error }, { data: allProjects }] = await Promise.all([
  useFetch<ProjectWithImages>(`/api/projects/${route.params.slug}`),
  useFetch<PublicProject[]>('/api/projects/public'),
])

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
const galleryImages = computed(() => project.value?.images.slice(1) ?? [])
const { cardEls, cardStyle } = useStackCards(computed(() => galleryImages.value.length))
const { el: contentEl, isVisible: contentVisible } = useReveal({ threshold: 0.05 })

const currentIndex = computed(() =>
  allProjects.value?.findIndex(p => p.slug === route.params.slug) ?? -1,
)
const prevProject = computed(() =>
  currentIndex.value > 0 ? allProjects.value![currentIndex.value - 1] : null,
)
const nextProject = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < (allProjects.value?.length ?? 0) - 1
    ? allProjects.value![currentIndex.value + 1]
    : null,
)

useSeoMeta({
  title: () => project.value?.metaTitle || project.value?.name || '',
  description: () => project.value?.metaDescription || project.value?.description || '',
  twitterCard: 'summary_large_image',
  ogLocale: 'fr_FR',
})

defineOgImage({
  component: 'Portfolio',
  title: project.value?.name,
  description: project.value?.description?.substring(0, 120) || undefined,
  label: `Projet · ${project.value?.year}`,
})

useSchemaOrg([
  defineWebPage({
    name: () => project.value?.name || '',
    description: () => project.value?.description || '',
    url: () => `https://matteo-bonneval.fr/projets/${route.params.slug}`,
    author: {
      '@type': 'Person',
      name: 'Mattéo Bonneval',
      url: 'https://matteo-bonneval.fr',
    },
    keywords: () => parseTags(project.value?.tags).join(', '),
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Accueil', item: '/' },
      { name: 'Projets', item: '/projets' },
      { name: () => project.value?.name || '', item: () => `/projets/${route.params.slug}` },
    ],
  }),
])
</script>

<template>
  <div v-if="project">
    <!-- Hero -->
    <section class="bg-neutral-950 overflow-hidden pt-24">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-14">
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
                style="font-size: clamp(2rem, 5vw, 5.5rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both"
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
              <UIcon name="i-lucide-code" class="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      <!-- Cover image -->
      <div
        v-if="coverImage"
        class="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden"
        style="animation: line-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s both"
      >
        <NuxtImg :src="coverImageSrc(project.images[0]?.url)!" :alt="project.name" sizes="100vw" class="w-full h-full object-cover" loading="eager" />
      </div>
    </section>

    <!-- Content -->
    <section ref="contentEl" class="bg-white dark:bg-neutral-950 py-16 lg:py-28">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          class="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 transition-all duration-700"
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
          <div class="flex flex-row lg:flex-col gap-8 lg:gap-10 flex-wrap">
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

    <!-- Gallery — stacking cards -->
    <section v-if="galleryImages.length" class="bg-neutral-50 dark:bg-neutral-900 pt-16 lg:pt-24">
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium mb-10">Galerie</p>
      </div>
      <div class="max-w-7xl mx-auto px-6 lg:px-12">
        <div
          v-for="(image, i) in galleryImages"
          :key="image.id"
          :ref="el => { cardEls[i] = el as HTMLElement }"
          class="mb-3 will-change-transform"
          :style="cardStyle(i)"
        >
          <div class="rounded-2xl lg:rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 aspect-[16/10] md:aspect-auto md:[height:calc(100svh-172px)]">
            <NuxtImg :src="coverImageSrc(image.url)!" :alt="project.name" sizes="100vw" class="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
        <div class="h-[30vh]" />
      </div>
    </section>

    <!-- Prev / Next navigation -->
    <div class="bg-neutral-950 border-t border-neutral-800/60">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <!-- Prev -->
        <NuxtLink
          v-if="prevProject"
          :to="`/projets/${prevProject.slug}`"
          class="group relative flex items-end overflow-hidden h-56 md:h-72 p-7 md:p-10 border-b md:border-b-0 border-neutral-800/60"
        >
          <NuxtImg
            v-if="prevProject.images[0]"
            :src="coverImageSrc(prevProject.images[0].url)!"
            :alt="prevProject.name"
            sizes="sm:100vw md:50vw"
            class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
          <div class="relative z-10">
            <p class="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-600 font-medium mb-3 group-hover:text-neutral-400 transition-colors duration-300">
              <UIcon name="i-lucide-arrow-left" class="size-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
              Projet précédent
            </p>
            <h3
              class="font-display font-black text-white tracking-tighter leading-[0.92] group-hover:translate-x-1.5 transition-transform duration-300"
              style="font-size: clamp(1.4rem, 3vw, 2.5rem)"
            >
              {{ prevProject.name }}
            </h3>
          </div>
        </NuxtLink>

        <!-- Spacer if no prev -->
        <div v-else class="hidden md:block border-r border-neutral-800/60" />

        <!-- Next -->
        <NuxtLink
          v-if="nextProject"
          :to="`/projets/${nextProject.slug}`"
          class="group relative flex items-end overflow-hidden h-56 md:h-72 p-7 md:p-10 md:border-l border-neutral-800/60"
        >
          <NuxtImg
            v-if="nextProject.images[0]"
            :src="coverImageSrc(nextProject.images[0].url)!"
            :alt="nextProject.name"
            sizes="sm:100vw md:50vw"
            class="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />
          <div class="relative z-10 md:ml-auto md:text-right w-full">
            <p class="flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-neutral-600 font-medium mb-3 md:justify-end group-hover:text-neutral-400 transition-colors duration-300">
              Projet suivant
              <UIcon name="i-lucide-arrow-right" class="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </p>
            <h3
              class="font-display font-black text-white tracking-tighter leading-[0.92] group-hover:-translate-x-1.5 transition-transform duration-300"
              style="font-size: clamp(1.4rem, 3vw, 2.5rem)"
            >
              {{ nextProject.name }}
            </h3>
          </div>
        </NuxtLink>

        <!-- Spacer if no next -->
        <div v-else class="hidden md:block" />
      </div>

      <!-- Back link -->
      <div class="border-t border-neutral-800/60 py-6 px-6 lg:px-12 max-w-7xl mx-auto">
        <NuxtLink
          to="/projets"
          class="group inline-flex items-center gap-2.5 text-sm text-neutral-600 hover:text-white transition-colors duration-200"
        >
          <UIcon name="i-lucide-layout-grid" class="size-3.5" />
          Tous les projets
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
