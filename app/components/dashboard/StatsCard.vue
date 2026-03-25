<script setup lang="ts">
defineProps<{
  icon: string
  label: string
  value: number | string
  sublabel?: string
  color?: 'primary' | 'success' | 'warning' | 'error' | 'neutral'
  to?: string
}>()

const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="rounded-xl border border-default bg-elevated/40 p-5 flex items-start gap-4 transition-colors"
    :class="to ? 'hover:bg-elevated/70 cursor-pointer' : ''"
  >
    <div
      class="size-10 rounded-lg flex items-center justify-center shrink-0"
      :class="{
        'bg-primary/10': color === 'primary' || !color,
        'bg-success/10': color === 'success',
        'bg-warning/10': color === 'warning',
        'bg-error/10': color === 'error',
        'bg-muted/10': color === 'neutral',
      }"
    >
      <UIcon
        :name="icon"
        class="size-5"
        :class="{
          'text-primary': color === 'primary' || !color,
          'text-success': color === 'success',
          'text-warning': color === 'warning',
          'text-error': color === 'error',
          'text-muted': color === 'neutral',
        }"
      />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-2xl font-bold text-default tabular-nums">{{ value }}</p>
      <p class="text-sm text-muted mt-0.5">{{ label }}</p>
      <p v-if="sublabel" class="text-xs text-muted/70 mt-0.5">{{ sublabel }}</p>
    </div>
  </component>
</template>