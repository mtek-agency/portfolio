<script setup lang="ts">
import type { Project } from '~~/server/db/schema'
import type { TableColumn } from '#ui/components/Table.vue'
import { minimalCreateProjectSchema } from '~~/shared/schemas/project.schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

type ProjectWithImageCount = Project & { images: { id: number }[] }

const { data: projects, refresh, status } = await useFetch<ProjectWithImageCount[]>('/api/projects')

// ─── Filtres ────────────────────────────────────────────────────────────────
const search = ref('')
const statusFilter = ref<'all' | 'active' | 'disabled'>('all')

const statusOptions = [
  { label: 'Tous les projets', value: 'all' },
  { label: 'Actifs', value: 'active' },
  { label: 'Désactivés', value: 'disabled' },
]

const filteredProjects = computed(() => {
  let list = projects.value ?? []

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  if (statusFilter.value === 'active') list = list.filter(p => !p.isDisabled)
  else if (statusFilter.value === 'disabled') list = list.filter(p => p.isDisabled)

  return list
})

const activeCount = computed(() => (projects.value ?? []).filter(p => !p.isDisabled).length)
const disabledCount = computed(() => (projects.value ?? []).filter(p => p.isDisabled).length)

// ─── Toggle disable ──────────────────────────────────────────────────────────
const togglingId = ref<number | null>(null)

async function toggleDisable(project: Project) {
  if (togglingId.value !== null) return
  togglingId.value = project.id
  try {
    await $fetch(`/api/projects/${project.slug}/disable`, {
      method: 'PATCH',
      body: { isDisabled: !project.isDisabled },
    })
    await refresh()
  }
  finally {
    togglingId.value = null
  }
}

// ─── Création ────────────────────────────────────────────────────────────────
const isOpen = ref(false)
const creating = ref(false)
const isAutoSlug = ref(true)

const createState = reactive({ name: '', slug: '' })

function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

watch(() => createState.name, (val) => {
  if (isAutoSlug.value) createState.slug = toSlug(val)
})

watch(isOpen, (val) => {
  if (!val) {
    createState.name = ''
    createState.slug = ''
    isAutoSlug.value = true
  }
})

async function onCreate() {
  creating.value = true
  try {
    const project = await $fetch<Project>('/api/projects', {
      method: 'POST',
      body: { name: createState.name, slug: createState.slug },
    })
    isOpen.value = false
    await navigateTo(`/admin/projets/${project.slug}`)
  }
  finally {
    creating.value = false
  }
}

// ─── Colonnes ────────────────────────────────────────────────────────────────
const columns: TableColumn<ProjectWithImageCount>[] = [
  { accessorKey: 'name', header: 'Projet' },
  { accessorKey: 'year', header: 'Année' },
  { accessorKey: 'tags', header: 'Tags' },
  { accessorKey: 'stack', header: 'Stack' },
  { accessorKey: 'isDisabled', header: 'Statut' },
  { accessorKey: 'id', id: 'actions' },
]
</script>

<template>
  <DashboardPanel title="Projets">
    <template #right>
      <UButton icon="i-lucide-plus" label="Nouveau projet" @click="isOpen = true" />
    </template>

    <div class="flex flex-col gap-4 p-4 h-full">
      <!-- Stats -->
      <div class="flex items-center gap-4 text-sm text-muted">
        <span><span class="font-semibold text-default">{{ activeCount }}</span> actif{{ activeCount !== 1 ? 's' : '' }}</span>
        <span class="text-default/20">·</span>
        <span><span class="font-semibold text-default">{{ disabledCount }}</span> désactivé{{ disabledCount !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Toolbar -->
      <div class="flex items-center gap-3">
        <UInput
          v-model="search"
          leading-icon="i-lucide-search"
          placeholder="Rechercher par nom, slug…"
          class="max-w-sm"
        />
        <USelect v-model="statusFilter" :items="statusOptions" class="w-48" />
        <span class="ml-auto text-sm text-muted">
          {{ filteredProjects.length }} résultat{{ filteredProjects.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Table -->
      <UTable :data="filteredProjects" :columns="columns" :loading="status === 'pending'" class="w-full">
        <template #actions-header>
          <div class="flex justify-end">
            Affichage / Modifier
          </div>
        </template>

        <template #name-cell="{ row }">
          <div class="flex flex-col gap-0.5 py-1">
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

        <template #tags-cell="{ row }">
          <div v-if="row.original.tags" class="flex flex-wrap gap-1">
            <UBadge
              v-for="tag in row.original.tags.split(',')"
              :key="tag"
              :label="tag.trim()"
              variant="subtle"
              color="primary"
              size="sm"
            />
          </div>
          <span v-else class="text-muted text-sm">—</span>
        </template>

        <template #stack-cell="{ row }">
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
        </template>

        <template #isDisabled-cell="{ row }">
          <UBadge
            :label="row.original.isDisabled ? 'Désactivé' : 'Actif'"
            :color="row.original.isDisabled ? 'neutral' : 'success'"
            variant="subtle"
          />
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
                  @update:model-value="toggleDisable(row.original)"
                />
              </span>
            </UTooltip>
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="sm"
              :to="`/admin/projets/${row.original.slug}`"
            />
          </div>
        </template>
      </UTable>
    </div>

    <!-- Slideover création -->
    <USlideover
        v-model:open="isOpen"
        side="right"
        :inset="true"
        title="Nouveau projet"
        description="Renseignez le nom et le slug pour créer le projet. Vous pourrez compléter les autres informations ensuite."
    >
      <template #body>
        <UForm
            :schema="minimalCreateProjectSchema"
            :state="createState"
            class="flex flex-col gap-5 p-4"
            @submit="onCreate"
        >
          <UFormField name="name" label="Nom du projet" required>
            <UInput
                v-model="createState.name"
                placeholder="Mon super projet"
                autofocus
                class="w-full"
            />
          </UFormField>

          <UFormField name="slug" label="Slug" hint="Généré automatiquement" required>
            <UInput
                v-model="createState.slug"
                placeholder="mon-super-projet"
                class="w-full"
                font="mono"
                @update:model-value="isAutoSlug = false"
            />
          </UFormField>

          <div class="pt-2 flex gap-3 justify-end">
            <UButton label="Annuler" variant="ghost" color="neutral" @click="isOpen = false" />
            <UButton type="submit" label="Créer le projet" :loading="creating" icon="i-lucide-plus" />
          </div>
        </UForm>
      </template>
    </USlideover>
  </DashboardPanel>
</template>