<script setup lang="ts">
import type { Tool } from '~~/server/db/schema'

const props = defineProps<{ tool: Tool, size?: 'sm' | 'md' }>()

const sizeClass = computed(() => props.size === 'sm' ? 'size-5' : 'size-7')

const faviconUrl = computed(() => {
  if (props.tool.icon) return null
  try {
    const domain = new URL(props.tool.url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
  }
  catch { return null }
})

const isLucide = computed(() => props.tool.icon?.startsWith('i-'))
</script>

<template>
  <img
    v-if="faviconUrl"
    :src="faviconUrl"
    :alt="tool.name"
    :class="sizeClass"
    class="rounded-sm object-contain"
  >
  <UIcon v-else-if="isLucide" :name="tool.icon!" :class="sizeClass" />
  <span v-else-if="tool.icon" class="text-xl leading-none select-none">{{ tool.icon }}</span>
  <UIcon v-else name="i-lucide-globe" :class="[sizeClass, 'text-muted']" />
</template>
