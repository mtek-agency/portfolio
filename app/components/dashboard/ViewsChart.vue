<script setup lang="ts">
import type { BreakdownData } from '~~/server/services/project.views.service'

const props = defineProps<{ data: BreakdownData, title?: string }>()

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#06b6d4', // cyan
  '#f97316', // orange
  '#ec4899', // pink
]

const selectedProjectId = ref<number | null>(null)
const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

function formatMonth(month: string) {
  const [, m] = month.split('-')
  return MONTHS_FR[parseInt(m) - 1]
}

function colorForProject(projectId: number) {
  const idx = props.data.projects.findIndex(p => p.id === projectId)
  return COLORS[idx % COLORS.length]
}

// Filtered timeline based on selected project
const timeline = computed(() => {
  if (selectedProjectId.value === null) return props.data.timeline
  return props.data.timeline.map(point => ({
    ...point,
    total: point.byProject[selectedProjectId.value!] ?? 0,
    byProject: { [selectedProjectId.value!]: point.byProject[selectedProjectId.value!] ?? 0 },
  }))
})

const maxTotal = computed(() => Math.max(...timeline.value.map(p => p.total), 1))
const grandTotal = computed(() => timeline.value.reduce((s, p) => s + p.total, 0))

function segmentHeight(views: number, total: number) {
  if (total === 0) return 0
  return (views / maxTotal.value) * 96
}

function barTotal(point: typeof timeline.value[0]) {
  return point.total
}

function tooltipText(point: typeof timeline.value[0]) {
  if (selectedProjectId.value !== null) {
    const views = point.byProject[selectedProjectId.value] ?? 0
    return `${views.toLocaleString('fr-FR')} vue${views !== 1 ? 's' : ''}`
  }
  const lines = props.data.projects
    .map(p => {
      const v = point.byProject[p.id] ?? 0
      return v > 0 ? `${p.name} : ${v.toLocaleString('fr-FR')}` : null
    })
    .filter(Boolean)
  return lines.length > 0 ? lines.join('\n') : 'Aucune vue'
}

// Segments to render for a given point (bottom → top order)
function segments(point: typeof timeline.value[0]) {
  if (selectedProjectId.value !== null) {
    const views = point.byProject[selectedProjectId.value] ?? 0
    return [{ projectId: selectedProjectId.value, views }]
  }
  return props.data.projects
    .map(p => ({ projectId: p.id, views: point.byProject[p.id] ?? 0 }))
    .filter(s => s.views > 0)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-baseline gap-3">
        <p class="text-sm font-medium text-default">{{ title ?? 'Vues sur le portfolio' }}</p>
        <p class="text-xs text-muted">{{ grandTotal.toLocaleString('fr-FR') }} sur 12 mois</p>
      </div>

      <!-- Légende / filtres -->
      <div class="flex items-center gap-1 flex-wrap">
        <button
          class="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium transition-colors"
          :class="selectedProjectId === null ? 'bg-elevated text-default' : 'text-muted hover:text-default'"
          @click="selectedProjectId = null"
        >
          Tous
        </button>
        <button
          v-for="(project, i) in data.projects"
          :key="project.id"
          class="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium transition-colors"
          :class="selectedProjectId === project.id ? 'bg-elevated text-default' : 'text-muted hover:text-default'"
          @click="selectedProjectId = selectedProjectId === project.id ? null : project.id"
        >
          <span
            class="size-2 rounded-full shrink-0"
            :style="{ background: COLORS[i % COLORS.length] }"
          />
          {{ project.name }}
        </button>
      </div>
    </div>

    <!-- Barres -->
    <div class="flex items-end gap-1 h-24">
      <UTooltip
        v-for="point in timeline"
        :key="point.month"
        :text="tooltipText(point)"
        :delay-duration="0"
        class="flex-1 h-24"
      >
        <div class="flex flex-col justify-end gap-px h-24 cursor-default group">
          <!-- Fond vide si 0 vues -->
          <div
            v-if="barTotal(point) === 0"
            class="w-full rounded-sm bg-muted/15"
            style="height: 3px"
          />
          <!-- Segments empilés (du bas vers le haut = rendu en ordre inverse) -->
          <template v-else>
            <div
              v-for="seg in segments(point)"
              :key="seg.projectId"
              class="w-full transition-opacity group-hover:opacity-80 first:rounded-t-sm"
              :style="{
                height: `${segmentHeight(seg.views, point.total)}px`,
                background: colorForProject(seg.projectId),
              }"
            />
          </template>
        </div>
      </UTooltip>
    </div>

    <!-- Axe X -->
    <div class="flex gap-1">
      <div v-for="point in timeline" :key="point.month" class="flex-1 text-center">
        <span class="text-[10px] text-muted leading-none">{{ formatMonth(point.month) }}</span>
      </div>
    </div>
  </div>
</template>
