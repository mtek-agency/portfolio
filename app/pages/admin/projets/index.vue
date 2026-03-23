<script setup lang="ts">
import type { Project } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

type ProjectWithImageCount = Project & { images: { id: number }[] }

const { data: projects, refresh, status } = await useFetch<ProjectWithImageCount[]>('/api/projects')

const { togglingId, toggleDisable } = useProjectToggle(refresh)

const isCreating = ref(false)
</script>

<template>
  <DashboardPanel title="Projets">
    <template #right>
      <UButton icon="i-lucide-plus" label="Nouveau projet" @click="isCreating = true" />
    </template>

    <ProjectsTable
      :projects="projects ?? []"
      :loading="status === 'pending'"
      :toggling-id="togglingId"
      @toggle="toggleDisable"
    />

    <ProjectsCreateSlideover v-model:open="isCreating" />
  </DashboardPanel>
</template>