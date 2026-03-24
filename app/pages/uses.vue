<script setup lang="ts">
import { TOOL_CATEGORIES } from '#shared/constants/tool'
import type { Tool } from '~~/server/db/schema'

const { data: tools } = await useFetch<Tool[]>('/api/tools/public')

const dailyDrivers = computed(() =>
  (tools.value ?? []).filter(t => t.isDailyDriver)
)

const groupedTools = computed(() => {
  const all = tools.value ?? []
  return Object.fromEntries(
    TOOL_CATEGORIES.map(c => [c.id, all.filter(t => t.category === c.id && !t.isDailyDriver)])
  )
})

const visibleCategories = computed(() =>
  TOOL_CATEGORIES.filter(c => (groupedTools.value[c.id]?.length ?? 0) > 0)
)

async function trackClick(tool: Tool) {
  await $fetch(`/api/tools/${tool.id}/click`, { method: 'POST' })
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-16">
    <div>
      <h1 class="text-3xl font-bold text-default">Uses</h1>
      <p class="mt-2 text-muted">Les outils et logiciels que j'utilise au quotidien.</p>
    </div>

    <!-- Daily drivers -->
    <section v-if="dailyDrivers.length > 0">
      <div class="flex items-center gap-2 mb-5">
        <UIcon name="i-lucide-zap" class="size-4 text-amber-500" />
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted">Daily drivers</h2>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <a
          v-for="tool in dailyDrivers"
          :key="tool.id"
          :href="tool.url"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-3 rounded-xl border border-default bg-elevated/40 px-4 py-3 hover:bg-elevated/70 transition-colors"
          @click="trackClick(tool)"
        >
          <div class="size-8 rounded-lg bg-default flex items-center justify-center shrink-0">
            <ToolsToolIcon :tool="tool" class="size-5" />
          </div>
          <span class="text-sm font-medium text-default truncate">{{ tool.name }}</span>
          <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity ml-auto shrink-0" />
        </a>
      </div>
    </section>

    <!-- Categories -->
    <section v-for="category in visibleCategories" :key="category.id">
      <div class="flex items-center gap-2 mb-5">
        <UIcon :name="category.icon" class="size-4 text-muted" />
        <h2 class="text-sm font-semibold uppercase tracking-wider text-muted">{{ category.label }}</h2>
      </div>
      <div class="flex flex-col divide-y divide-default">
        <a
          v-for="tool in groupedTools[category.id]"
          :key="tool.id"
          :href="tool.url"
          target="_blank"
          rel="noopener"
          class="group flex items-center gap-3 py-3 hover:text-default transition-colors"
          @click="trackClick(tool)"
        >
          <div class="size-7 rounded-md bg-elevated flex items-center justify-center shrink-0">
            <ToolsToolIcon :tool="tool" class="size-4" />
          </div>
          <span class="text-sm font-medium text-default flex-1">{{ tool.name }}</span>
          <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </a>
      </div>
    </section>
  </div>
</template>