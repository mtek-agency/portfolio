<script setup lang="ts">
import type { Tool } from '~~/server/db/schema'

defineProps<{ tool: Tool }>()

const emit = defineEmits<{
  edit: [tool: Tool]
  toggle: [tool: Tool]
  delete: [tool: Tool]
}>()
</script>

<template>
  <div
    class="group relative rounded-lg border border-default bg-elevated/40 px-3 py-2 flex items-center gap-2 transition-colors hover:bg-elevated/70"
    :class="{ 'opacity-40': !tool.isActive }"
  >
    <!-- Drag handle -->
    <div class="drag-handle cursor-grab active:cursor-grabbing text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <UIcon name="i-lucide-grip-vertical" class="size-3.5" />
    </div>

    <!-- Icon -->
    <div class="size-7 rounded-md bg-default flex items-center justify-center shrink-0">
      <ToolsToolIcon :tool="tool" class="size-4" />
    </div>

    <!-- Name -->
    <a :href="tool.url" target="_blank" rel="noopener" class="text-sm font-medium text-default truncate flex-1 min-w-0 hover:underline">{{ tool.name }}</a>

    <!-- Actions -->
    <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
      <UTooltip text="Ouvrir">
        <UButton icon="i-lucide-external-link" variant="ghost" color="neutral" size="xs" :to="tool.url" target="_blank" @click.stop />
      </UTooltip>
      <UTooltip :text="tool.isActive ? 'Désactiver' : 'Activer'">
        <UButton icon="i-lucide-power" variant="ghost" color="neutral" size="xs" @click.stop="emit('toggle', tool)" />
      </UTooltip>
      <UTooltip text="Modifier">
        <UButton icon="i-lucide-pencil" variant="ghost" color="neutral" size="xs" @click.stop="emit('edit', tool)" />
      </UTooltip>
      <UTooltip text="Supprimer">
        <UButton icon="i-lucide-trash-2" variant="ghost" color="error" size="xs" @click.stop="emit('delete', tool)" />
      </UTooltip>
    </div>
  </div>
</template>
