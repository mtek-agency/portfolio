<script setup lang="ts">
import type { ProjectWithImageCount } from '~/composables/useProjectFilters'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

const { data: projects, status } = await useFetch<ProjectWithImageCount[]>('/api/projects', { key: 'projects' })
const { togglingId, toggleDisable } = useProjectToggle()
const { importInput, exportProjects, onImportFile } = useProjectExportImport()

useKeyboardShortcut('d', () => { isCreating.value = true }, { meta: true })

const isCreating = ref(false)
</script>

<template>
  <DashboardPanel title="Projets">
    <template #right>
      <UButton
        icon="i-lucide-upload"
        label="Importer"
        variant="ghost"
        color="neutral"
        @click="importInput?.click()"
      />
      <UButton
        icon="i-lucide-download"
        label="Exporter"
        variant="ghost"
        color="neutral"
        @click="exportProjects"
      />
      <UButton icon="i-lucide-plus" @click="isCreating = true">
        Nouveau projet
        <template #trailing>
          <span class="flex items-center gap-0.5 ml-0.5">
            <UKbd value="meta" size="sm" color="neutral" variant="subtle" />
            <UKbd value="d" size="sm" color="neutral" variant="subtle" />
          </span>
        </template>
      </UButton>
    </template>

    <input ref="importInput" type="file" accept=".csv" class="hidden" @change="onImportFile">

    <ProjectsTable
      :projects="projects ?? []"
      :loading="status === 'pending'"
      :toggling-id="togglingId"
      @toggle="toggleDisable"
    />

    <ProjectsCreateSlideover v-model:open="isCreating" />
  </DashboardPanel>
</template>