<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  loading: boolean
}>()

const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ confirm: [], cancel: [] }>()
</script>

<template>
  <UModal v-model:open="open" :title="title ?? 'Confirmer la suppression'">
    <template #body>
      <p class="text-sm text-muted">{{ description ?? 'Cette action est irréversible.' }}</p>
    </template>
    <template #footer>
      <div class="flex gap-3 justify-end w-full">
        <UButton label="Annuler" variant="ghost" color="neutral" @click="emit('cancel')" />
        <UButton label="Supprimer" icon="i-lucide-trash-2" color="error" :loading="loading" @click="emit('confirm')" />
      </div>
    </template>
  </UModal>
</template>
