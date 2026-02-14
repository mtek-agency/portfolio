<script setup lang="ts">
import type { Project } from '~~/server/db/schema'
import type { TableColumn } from '#ui/components/Table.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const { data: projects } = await useFetch<Project[]>('/api/projects')
const columns: TableColumn<Project>[] = [
  {
    accessorKey: 'id',
    header: '#',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Nom'
  }
]
</script>

<template>
  <DashboardPanel title="Projets">
    <slot name="body">
      <UTable
          :data="projects"
          :columns="columns"
          class="flex-1"
      />
    </slot>
  </DashboardPanel>
</template>