<script setup lang="ts">
import type { Tool } from '#shared/types/studio'

defineProps<{ tools: Tool[] }>()

const { el, isVisible } = useReveal()
const { spots, onMouseMove, onMouseLeave, cardStyle } = useToolCard()
</script>

<template>
  <section
    ref="el"
    class="bg-neutral-50 dark:bg-neutral-950 py-16 lg:py-32 border-t border-neutral-200 dark:border-neutral-800/60"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div
        class="flex items-baseline justify-between mb-12 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <p class="text-xs tracking-[0.3em] uppercase text-neutral-600 font-medium">Liens & outils</p>
        <span class="text-xs font-mono text-neutral-700">{{ String(tools.length).padStart(2, '0') }}</span>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <a
          v-for="(tool, i) in tools"
          :key="tool.id"
          :href="tool.url"
          target="_blank"
          rel="noopener noreferrer"
          class="group relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 min-h-[120px] will-change-transform"
          :class="isVisible ? 'opacity-100' : 'opacity-0 translate-y-6'"
          :style="cardStyle(tool.id, isVisible, i)"
          @mousemove="(e) => onMouseMove(e, tool.id)"
          @mouseleave="onMouseLeave(tool.id)"
        >
          <!-- Border glow on hover -->
          <div
            class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style="box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12);"
          />

          <!-- Icon -->
          <div class="relative z-10">
            <UIcon
              v-if="tool.icon"
              :name="tool.icon"
              class="size-6 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-500"
            />
            <div v-else class="size-6 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>

          <!-- Name + arrow + description -->
          <div class="relative z-10">
            <div class="flex items-end justify-between gap-2">
              <span class="font-display font-bold text-sm leading-tight text-neutral-600 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors duration-500">
                {{ tool.name }}
              </span>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-3.5 shrink-0 text-neutral-400 dark:text-neutral-700 group-hover:text-neutral-950 dark:group-hover:text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
            <div
              v-if="tool.description"
              class="overflow-hidden transition-all duration-400 ease-out"
              :style="spots[tool.id] ? 'max-height: 3rem; opacity: 1; margin-top: 0.5rem' : 'max-height: 0; opacity: 0; margin-top: 0'"
            >
              <p class="text-xs text-neutral-500 leading-relaxed">{{ tool.description }}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>
