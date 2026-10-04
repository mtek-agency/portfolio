<script setup lang="ts">
import type { PublicProject } from '#shared/types/studio'

defineProps<{
  byYear: [string, PublicProject[]][]
}>()

// Must match card height in Card.vue: calc(100svh - 172px) + 12px gap
const CARD_H = 'calc(100svh - 172px + 12px)'
</script>

<template>
  <div class="relative hidden md:block w-16 lg:w-20 shrink-0">
    <!-- Vertical line -->
    <div class="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-neutral-200 dark:bg-neutral-800" />

    <!-- Year sections — each sized to match its group's cards height -->
    <div
      v-for="([year, yearProjects]) in byYear"
      :key="year"
      :style="{ height: `calc(${CARD_H} * ${yearProjects.length})` }"
      class="relative"
    >
      <div class="sticky top-28 flex flex-col items-center gap-2 pt-1">
        <div class="size-2 rounded-full bg-neutral-950 dark:bg-white ring-4 ring-neutral-50 dark:ring-neutral-950 relative z-10" />
        <span
          class="text-[10px] font-mono font-semibold text-neutral-500 dark:text-neutral-400 tracking-widest"
          style="writing-mode: vertical-lr; transform: rotate(180deg)"
        >
          {{ year }}
        </span>
        <span class="text-[10px] text-neutral-400 dark:text-neutral-600 font-mono">
          {{ yearProjects.length.toString().padStart(2, '0') }}
        </span>
      </div>
    </div>
  </div>
</template>
