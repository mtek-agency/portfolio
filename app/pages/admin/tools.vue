<script setup lang="ts">
import { TOOL_CATEGORIES } from '#shared/constants/tool'
import type { Tool } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

const { groupedTools, refresh, onReorder, toggle, remove } = useTools()

// Search + filter
const search = ref('')
const categoryFilter = ref<string | null>(null)

const categoryFilterOptions = [
  { label: 'Toutes', value: null },
  ...TOOL_CATEGORIES.map(c => ({ label: c.label, value: c.id })),
]

const visibleCategories = computed(() =>
  TOOL_CATEGORIES.filter(c =>
    (categoryFilter.value === null || c.id === categoryFilter.value)
    && (search.value === '' || groupedTools[c.id]?.some(t => t.name.toLowerCase().includes(search.value.toLowerCase())))
  )
)

// Slideover
const slideoverOpen = ref(false)
const editingTool = ref<Tool | null>(null)
const defaultCategory = ref<string>('dev')

function openCreate(categoryId?: string) {
  editingTool.value = null
  defaultCategory.value = categoryId ?? 'dev'
  slideoverOpen.value = true
}

function openEdit(tool: Tool) {
  editingTool.value = tool
  slideoverOpen.value = true
}

// Delete confirmation
const deleteModalOpen = ref(false)
const pendingDelete = ref<Tool | null>(null)
const deleting = ref(false)

function requestDelete(tool: Tool) {
  pendingDelete.value = tool
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!pendingDelete.value) return
  deleting.value = true
  try {
    await remove(pendingDelete.value)
    deleteModalOpen.value = false
    pendingDelete.value = null
  }
  finally {
    deleting.value = false
  }
}
</script>

<template>
  <DashboardPanel title="Outils">
    <template #right>
      <UButton icon="i-lucide-plus" label="Ajouter" @click="openCreate()" />
    </template>

    <div class="p-6 flex flex-col gap-6">
      <!-- Toolbar -->
      <div class="flex items-center gap-3 flex-wrap">
        <UInput
          v-model="search"
          leading-icon="i-lucide-search"
          placeholder="Rechercher un outil…"
          class="max-w-xs"
        />
        <div class="flex items-center gap-1">
          <UButton
            v-for="opt in categoryFilterOptions"
            :key="String(opt.value)"
            :label="opt.label"
            size="xs"
            :variant="categoryFilter === opt.value ? 'soft' : 'ghost'"
            :color="categoryFilter === opt.value ? 'primary' : 'neutral'"
            @click="categoryFilter = opt.value"
          />
        </div>
      </div>

      <!-- Category groups -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ToolsCategoryGroup
          v-for="cat in visibleCategories"
          :key="cat.id"
          v-model="groupedTools[cat.id]"
          :category-id="cat.id"
          :category-label="cat.label"
          :category-icon="cat.icon"
          @reorder="onReorder"
          @edit="openEdit"
          @toggle="toggle"
          @delete="requestDelete"
          @add="openCreate(cat.id)"
        />
      </div>

      <!-- Empty state -->
      <div v-if="visibleCategories.length === 0" class="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <UIcon name="i-lucide-search-x" class="size-8 text-muted" />
        <p class="text-sm text-muted">Aucun résultat pour "{{ search }}"</p>
      </div>
    </div>
    <!-- Form slideover -->
    <ToolsFormSlideover
        v-model:open="slideoverOpen"
        :tool="editingTool"
        :default-category="defaultCategory"
        @saved="refresh"
    />

    <!-- Delete modal -->
    <UModal v-model:open="deleteModalOpen" title="Supprimer l'outil">
      <template #body>
        <p class="text-sm text-muted">
          Supprimer <span class="font-semibold text-default">{{ pendingDelete?.name }}</span> ?
          Cette action est irréversible.
        </p>
      </template>
      <template #footer>
        <div class="flex gap-3 justify-end w-full">
          <UButton label="Annuler" variant="ghost" color="neutral" @click="deleteModalOpen = false" />
          <UButton label="Supprimer" icon="i-lucide-trash-2" color="error" :loading="deleting" @click="confirmDelete" />
        </div>
      </template>
    </UModal>
  </DashboardPanel>
</template>
