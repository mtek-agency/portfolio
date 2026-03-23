<script setup lang="ts">
import type { Project } from '~~/server/db/schema'
import type { TableColumn } from '#ui/components/Table.vue'
import type { ProjectWithImageCount } from '~/composables/useProjectFilters'

const props = defineProps<{
  projects: ProjectWithImageCount[]
  loading: boolean
  togglingId: number | null
}>()

const emit = defineEmits<{
  toggle: [project: Project]
}>()

const projectsRef = toRef(props, 'projects')
const { search, statusFilter, statusOptions, filteredProjects, activeCount, disabledCount } = useProjectFilters(projectsRef)

const columns: TableColumn<ProjectWithImageCount>[] = [
  { accessorKey: 'name', header: 'Projet', enableSorting: true },
  { accessorKey: 'year', header: 'Année', enableSorting: true },
  { accessorKey: 'tags', header: 'Tags' },
  { accessorKey: 'stack', header: 'Stack' },
  { accessorKey: 'isDisabled', header: 'Statut', enableSorting: true },
  { accessorKey: 'id', id: 'actions' },
]

function navigateToProject(slug: string) {
  navigateTo(`/admin/projets/${slug}`)
}
</script>

<template>
  <div class="flex flex-col gap-4 p-4 h-full">
    <!-- Stats -->
    <div class="flex items-center gap-4 text-sm text-muted">
      <span><span class="font-semibold text-default">{{ activeCount }}</span> actif{{ activeCount !== 1 ? 's' : '' }}</span>
      <span class="text-default/20">·</span>
      <span><span class="font-semibold text-default">{{ disabledCount }}</span> désactivé{{ disabledCount !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-3">
      <UInput v-model="search" leading-icon="i-lucide-search" placeholder="Rechercher par nom, slug…" class="max-w-sm" />
      <USelect v-model="statusFilter" :items="statusOptions" class="w-48" />
      <span class="ml-auto text-sm text-muted">
        {{ filteredProjects.length }} résultat{{ filteredProjects.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Table -->
    <UTable
      :data="filteredProjects"
      :columns="columns"
      :loading="loading"
      class="w-full"
      :ui="{ tr: 'cursor-pointer hover:bg-elevated/50 transition-colors' }"
    >
      <template #actions-header>
        <div class="flex justify-end">Affichage / Modifier</div>
      </template>

      <template #name-cell="{ row }">
        <div class="flex flex-col gap-0.5 py-1" @click="navigateToProject(row.original.slug)">
          <div class="flex items-center gap-2">
            <span class="font-medium text-default">{{ row.original.name }}</span>
            <UBadge
              :label="`${row.original.images.length} image${row.original.images.length !== 1 ? 's' : ''}`"
              variant="soft"
              color="neutral"
              size="xs"
            />
          </div>
          <span class="text-xs text-muted font-mono">{{ row.original.slug }}</span>
        </div>
      </template>

      <template #year-cell="{ row }">
        <span @click="navigateToProject(row.original.slug)">{{ row.original.year }}</span>
      </template>

      <template #tags-cell="{ row }">
        <div class="py-1" @click="navigateToProject(row.original.slug)">
          <div v-if="row.original.tags" class="flex flex-wrap gap-1">
            <UBadge v-for="tag in row.original.tags.split(',')" :key="tag" :label="tag.trim()" variant="subtle" color="primary" size="sm" />
          </div>
          <span v-else class="text-muted text-sm">—</span>
        </div>
      </template>

      <template #stack-cell="{ row }">
        <div class="py-1" @click="navigateToProject(row.original.slug)">
          <div v-if="row.original.stack" class="flex flex-wrap gap-1">
            <UBadge
              v-for="tech in row.original.stack.split(',').slice(0, 3)"
              :key="tech"
              :label="tech.trim()"
              variant="outline"
              color="neutral"
              size="sm"
            />
            <UBadge
              v-if="row.original.stack.split(',').length > 3"
              :label="`+${row.original.stack.split(',').length - 3}`"
              variant="soft"
              color="neutral"
              size="sm"
            />
          </div>
          <span v-else class="text-muted text-sm">—</span>
        </div>
      </template>

      <template #isDisabled-cell="{ row }">
        <div @click="navigateToProject(row.original.slug)">
          <UBadge
            :label="row.original.isDisabled ? 'Désactivé' : 'Actif'"
            :color="row.original.isDisabled ? 'neutral' : 'success'"
            variant="subtle"
          />
        </div>
      </template>

      <template #actions-cell="{ row }">
        <div class="flex items-center gap-2 justify-end">
          <UTooltip :text="row.original.isDisabled ? 'Activer' : 'Désactiver'">
            <span>
              <USwitch
                :model-value="!row.original.isDisabled"
                :loading="togglingId === row.original.id"
                :disabled="togglingId !== null && togglingId !== row.original.id"
                size="sm"
                @update:model-value="emit('toggle', row.original)"
              />
            </span>
          </UTooltip>
          <UButton icon="i-lucide-pencil" variant="ghost" color="neutral" size="sm" :to="`/admin/projets/${row.original.slug}`" />
        </div>
      </template>
    </UTable>
  </div>
</template>