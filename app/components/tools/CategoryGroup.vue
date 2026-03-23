<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Tool } from '~~/server/db/schema'

const props = defineProps<{
  categoryId: string
  categoryLabel: string
  categoryIcon: string
  modelValue: Tool[]
}>()

const emit = defineEmits<{
  'update:modelValue': [Tool[]]
  reorder: []
  edit: [tool: Tool]
  toggle: [tool: Tool]
  delete: [tool: Tool]
  add: []
}>()

const localTools = useModel(props, 'modelValue', emit)
</script>

<template>
  <div class="rounded-xl border border-default bg-elevated/40 p-4 flex flex-col gap-3">
    <!-- Category header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-sm font-semibold text-default">
        <UIcon :name="categoryIcon" class="size-4 text-muted" />
        {{ categoryLabel }}
        <span class="text-xs font-normal text-muted">({{ modelValue.length }})</span>
      </div>
      <UButton icon="i-lucide-plus" variant="ghost" color="neutral" size="xs" @click="emit('add')" />
    </div>

    <!-- Draggable grid -->
    <VueDraggable
      v-model="localTools"
      group="tools"
      handle=".drag-handle"
      :animation="150"
      ghost-class="opacity-40"
      class="grid grid-cols-2 gap-2 min-h-10"
      @end="emit('reorder')"
    >
      <ToolsToolCard
        v-for="tool in localTools"
        :key="tool.id"
        :tool="tool"
        @edit="emit('edit', $event)"
        @toggle="emit('toggle', $event)"
        @delete="emit('delete', $event)"
      />
    </VueDraggable>

    <div v-if="modelValue.length === 0" class="rounded-lg border border-dashed border-default flex items-center justify-center py-4 text-sm text-muted">
      Aucun outil — <button class="underline ml-1" @click="emit('add')">en ajouter un</button>
    </div>
  </div>
</template>
