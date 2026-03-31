<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { Parcours } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  pageTransition: false,
})

useHead({ title: 'Parcours' })

const { items, refresh, onReorder, toggle, remove } = useParcours()
const deleteConfirm = useDeleteConfirm<Parcours>()

const localItems = ref<Parcours[]>([])
watch(items, (val) => { localItems.value = [...val] }, { immediate: true })

const slideoverOpen = ref(false)
const editingItem = ref<Parcours | null>(null)

function openCreate() {
  editingItem.value = null
  slideoverOpen.value = true
}

function openEdit(item: Parcours) {
  editingItem.value = item
  slideoverOpen.value = true
}

async function handleReorder() {
  await onReorder(localItems.value)
}
</script>

<template>
  <DashboardPanel title="Parcours">
    <template #right>
      <UButton icon="i-lucide-plus" label="Ajouter" @click="openCreate()" />
    </template>

    <div class="p-6 flex flex-col gap-4">
      <!-- Empty state -->
      <div v-if="localItems.length === 0" class="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <UIcon name="i-lucide-briefcase" class="size-8 text-muted" />
        <p class="text-sm text-muted">Aucune entrée — commencez par en ajouter une.</p>
        <UButton label="Ajouter une entrée" variant="soft" size="sm" @click="openCreate()" />
      </div>

      <!-- Draggable list -->
      <VueDraggable
        v-model="localItems"
        handle=".drag-handle"
        :animation="150"
        ghost-class="opacity-40"
        class="flex flex-col gap-2"
        @end="handleReorder"
      >
        <div
          v-for="item in localItems"
          :key="item.id"
          class="flex items-center gap-4 rounded-xl border border-default bg-elevated/40 p-4 group"
        >
          <!-- Drag handle -->
          <button class="drag-handle cursor-grab active:cursor-grabbing text-muted hover:text-default transition-colors shrink-0">
            <UIcon name="i-lucide-grip-vertical" class="size-4" />
          </button>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-semibold text-sm text-default truncate">{{ item.role }}</span>
              <span class="text-xs text-muted">·</span>
              <span class="text-xs text-muted truncate">{{ item.place }}</span>
            </div>
            <div class="flex items-center gap-2 mt-0.5">
              <span class="text-xs font-mono text-muted">{{ item.period }}</span>
              <UBadge
                :label="item.isActive ? 'Visible' : 'Masqué'"
                :color="item.isActive ? 'success' : 'neutral'"
                variant="soft"
                size="xs"
              />
            </div>
            <p v-if="item.description" class="text-xs text-muted mt-1 truncate">{{ item.description }}</p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <UButton
              :icon="item.isActive ? 'i-lucide-eye-off' : 'i-lucide-eye'"
              variant="ghost"
              color="neutral"
              size="xs"
              :title="item.isActive ? 'Masquer' : 'Afficher'"
              @click="toggle(item)"
            />
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEdit(item)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="deleteConfirm.request(item)"
            />
          </div>
        </div>
      </VueDraggable>
    </div>

    <!-- Form slideover -->
    <ParcoursFormSlideover
      v-model:open="slideoverOpen"
      :item="editingItem"
      @saved="refresh"
    />

    <!-- Delete confirm -->
    <UiConfirmDeleteModal
      v-model:open="deleteConfirm.open.value"
      :title="`Supprimer « ${deleteConfirm.item.value?.role} » ?`"
      description="Cette action est irréversible."
      :loading="deleteConfirm.loading.value"
      @confirm="deleteConfirm.confirm(remove)"
      @cancel="deleteConfirm.cancel()"
    />
  </DashboardPanel>
</template>
