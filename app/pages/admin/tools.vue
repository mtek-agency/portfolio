<script setup lang="ts">
import { TOOL_CATEGORIES } from '#shared/constants/tool'
import type { Tool } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  pageTransition: false,
})

useHead({ title: 'Outils' })

const { groupedTools, refresh, onReorder, toggle, remove } = useTools()
const deleteConfirm = useDeleteConfirm<Tool>()

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

async function deleteTool(tool: Tool) {
  await remove(tool)
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
        <UInput v-model="search" leading-icon="i-lucide-search" placeholder="Rechercher un outil…" class="max-w-xs" />
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
          @delete="deleteConfirm.request"
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

    <!-- Delete confirm -->
    <UiConfirmDeleteModal
      v-model:open="deleteConfirm.open.value"
      :title="`Supprimer « ${deleteConfirm.item.value?.name} » ?`"
      description="Cette action est irréversible."
      :loading="deleteConfirm.loading.value"
      @confirm="deleteConfirm.confirm(deleteTool)"
      @cancel="deleteConfirm.cancel()"
    />
  </DashboardPanel>
</template>
