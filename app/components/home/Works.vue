<script setup lang="ts">
import type { PublicProject } from '~/types/home'

defineProps<{ projects: PublicProject[] }>()

const { el, isVisible } = useReveal()
const { el: ctaEl, isVisible: ctaVisible } = useReveal({ threshold: 0.8 })
const { hoveredImage, mouseX, mouseY, onHover, onLeave, onMouseMove } = useProjectHover()
</script>

<template>
  <section ref="el" class="bg-neutral-50 dark:bg-neutral-950 py-16 lg:py-36" @mousemove="onMouseMove">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div
        class="flex items-baseline justify-between mb-16 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <p class="text-xs tracking-[0.3em] uppercase text-neutral-400 font-medium">Travaux sélectionnés</p>
        <span class="text-xs font-mono text-neutral-400">{{ String(projects.length).padStart(2, '0') }}</span>
      </div>

      <!-- Floating hover image -->
      <Teleport to="body">
        <Transition name="hover-image">
          <div
            v-if="hoveredImage"
            class="fixed pointer-events-none z-40 w-72 h-48 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10"
            :style="{ left: `${mouseX + 28}px`, top: `${mouseY - 96}px` }"
          >
            <img :src="hoveredImage" class="w-full h-full object-cover" alt="" />
          </div>
        </Transition>
      </Teleport>

      <div>
        <div
          v-for="(project, i) in projects"
          :key="project.id"
          class="group flex items-center justify-between py-6 border-b border-neutral-100 dark:border-neutral-800/80 cursor-pointer select-none transition-all duration-500"
          data-cursor="VOIR"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          :style="{ transitionDelay: isVisible ? `${i * 75}ms` : '0ms' }"
          @click="navigateTo(`/projets/${project.slug}`)"
          @mousemove="(e) => onHover(e, project)"
          @mouseleave="onLeave"
        >
          <div class="flex items-start gap-6 md:gap-10 min-w-0">
            <span class="text-xs font-mono text-neutral-300 dark:text-neutral-700 w-6 shrink-0 mt-1.5">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="flex flex-col gap-1 min-w-0">
              <span class="font-display font-bold text-xl md:text-3xl text-neutral-900 dark:text-neutral-100 group-hover:translate-x-3 transition-transform duration-300 ease-out">
                {{ project.name }}
              </span>
              <span v-if="project.description" class="hidden md:block text-sm text-neutral-400 dark:text-neutral-500 truncate max-w-lg">
                {{ project.description }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-3 md:gap-6 shrink-0">
            <div class="hidden md:flex gap-2">
              <span
                v-for="tag in parseTags(project.tags).slice(0, 2)"
                :key="tag"
                class="text-xs px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-400"
              >{{ tag }}</span>
            </div>
            <span class="text-sm text-neutral-400 font-mono">{{ project.year }}</span>
            <div class="size-8 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center transition-all duration-300 group-hover:bg-neutral-950 group-hover:border-neutral-950 dark:group-hover:bg-white dark:group-hover:border-white">
              <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-neutral-400 group-hover:text-white dark:group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div
        ref="ctaEl"
        class="mt-12 flex justify-end transition-all duration-700"
        :class="ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        <UiMagnetic>
          <NuxtLink to="/projets" class="group inline-flex items-center gap-4 text-neutral-950 dark:text-white">
            <span class="text-xs tracking-[0.25em] uppercase font-medium">Tous les projets</span>
            <div class="size-12 rounded-full border flex items-center justify-center transition-all duration-300 bg-neutral-950 border-neutral-950 dark:bg-white dark:border-white">
              <UIcon name="i-lucide-arrow-right" class="size-4 text-white dark:text-black transition-transform duration-300 group-hover:-rotate-45" />
            </div>
          </NuxtLink>
        </UiMagnetic>
      </div>
    </div>
  </section>
</template>
