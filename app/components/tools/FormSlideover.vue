<script setup lang="ts">
import type { Tool } from '~~/server/db/schema'
import { toolCreateSchema } from '#shared/schemas/tool.schema'
import { TOOL_CATEGORIES } from '#shared/constants/tool'
import type { FormSubmitEvent } from '#ui/types'
import type { ToolCreateInput } from '#shared/schemas/tool.schema'

const props = defineProps<{ tool?: Tool | null, defaultCategory?: string }>()
const emit = defineEmits<{ saved: [], cancel: [] }>()

const open = defineModel<boolean>('open', { default: false })
const toast = useAppToast()
const saving = ref(false)

const isEdit = computed(() => !!props.tool)

const formState = reactive<ToolCreateInput>({
  name: '',
  url: '',
  icon: '',
  description: '',
  category: (props.defaultCategory ?? 'dev') as ToolCreateInput['category'],
  isActive: true,
  isPublic: false,
  isDailyDriver: false,
})

watch(() => props.tool, (tool) => {
  if (tool) {
    formState.name = tool.name
    formState.url = tool.url
    formState.icon = tool.icon ?? ''
    formState.description = tool.description ?? ''
    formState.category = tool.category as ToolCreateInput['category']
    formState.isActive = tool.isActive
    formState.isPublic = tool.isPublic
    formState.isDailyDriver = tool.isDailyDriver
  }
  else {
    formState.name = ''
    formState.url = ''
    formState.icon = ''
    formState.description = ''
    formState.category = (props.defaultCategory ?? 'dev') as ToolCreateInput['category']
    formState.isActive = true
    formState.isPublic = false
    formState.isDailyDriver = false
  }
}, { immediate: true })

const categoryOptions = TOOL_CATEGORIES.map(c => ({ label: c.label, value: c.id }))

// Favicon preview
const faviconPreview = computed(() => {
  if (formState.icon) return null
  try {
    const domain = new URL(formState.url).hostname
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null
  }
  catch { return null }
})

async function onSubmit(event: FormSubmitEvent<ToolCreateInput>) {
  saving.value = true
  try {
    if (isEdit.value && props.tool) {
      await $fetch(`/api/tools/${props.tool.id}`, { method: 'PUT', body: event.data })
      toast.success('Outil mis à jour')
    }
    else {
      await $fetch('/api/tools', { method: 'POST', body: event.data })
      toast.success('Outil ajouté')
    }
    open.value = false
    emit('saved')
  }
  catch {
    toast.error('Erreur', "Impossible de sauvegarder l'outil")
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <USlideover v-model:open="open" :title="isEdit ? 'Modifier l\'outil' : 'Ajouter un outil'" side="right" inset>
    <template #body>
      <UForm
        id="tool-form"
        :schema="toolCreateSchema"
        :state="formState"
        class="flex flex-col gap-5 p-4"
        @submit="onSubmit"
      >
        <UFormField name="name" label="Nom" required>
          <UInput v-model="formState.name" placeholder="GitHub" class="w-full" />
        </UFormField>

        <UFormField name="url" label="URL" required>
          <UInput v-model="formState.url" placeholder="https://github.com" leading-icon="i-lucide-link" class="w-full" />
        </UFormField>

        <UFormField name="icon" label="Icône" hint="Emoji, nom Lucide (i-lucide-...) ou vide pour favicon auto">
          <div class="flex items-center gap-3">
            <UInput v-model="formState.icon" placeholder="🚀 ou i-lucide-code-2" class="flex-1" />
            <!-- Preview -->
            <div class="size-10 rounded-lg bg-elevated flex items-center justify-center shrink-0 border border-default">
              <img v-if="faviconPreview && !formState.icon" :src="faviconPreview" class="size-6 rounded-sm" alt="favicon">
              <UIcon v-else-if="formState.icon?.startsWith('i-')" :name="formState.icon" class="size-6" />
              <span v-else-if="formState.icon" class="text-xl leading-none">{{ formState.icon }}</span>
              <UIcon v-else name="i-lucide-image" class="size-5 text-muted" />
            </div>
          </div>
        </UFormField>

        <UFormField name="description" label="Description" hint="Texte affiché au survol sur le portfolio (max 200 car.)">
          <UInput v-model="formState.description" placeholder="Retrouve tous mes projets open source" class="w-full" />
        </UFormField>

        <UFormField name="category" label="Catégorie" required>
          <USelect v-model="formState.category" :items="categoryOptions" class="w-full" />
        </UFormField>

        <UFormField name="isActive" label="Statut">
          <div class="flex items-center gap-3">
            <USwitch v-model="formState.isActive" />
            <span class="text-sm text-muted">{{ formState.isActive ? 'Actif' : 'Inactif' }}</span>
          </div>
        </UFormField>

        <UFormField name="isPublic" label="Visible sur le portfolio">
          <div class="flex items-center gap-3">
            <USwitch v-model="formState.isPublic" />
            <span class="text-sm text-muted">{{ formState.isPublic ? 'Public' : 'Privé' }}</span>
          </div>
        </UFormField>

        <UFormField name="isDailyDriver" label="Daily driver">
          <div class="flex items-center gap-3">
            <USwitch v-model="formState.isDailyDriver" />
            <span class="text-sm text-muted">{{ formState.isDailyDriver ? 'Utilisé quotidiennement' : 'Usage occasionnel' }}</span>
          </div>
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex gap-3 justify-end w-full p-4">
        <UButton label="Annuler" variant="ghost" color="neutral" @click="open = false" />
        <UButton
          :label="isEdit ? 'Mettre à jour' : 'Ajouter'"
          icon="i-lucide-check"
          form="tool-form"
          type="submit"
          :loading="saving"
        />
      </div>
    </template>
  </USlideover>
</template>
