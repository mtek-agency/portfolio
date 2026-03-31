<script setup lang="ts">
import type { Parcours } from '~~/server/db/schema'
import { parcoursCreateSchema } from '#shared/schemas/parcours.schema'
import type { FormSubmitEvent } from '#ui/types'
import type { ParcoursCreateInput } from '#shared/schemas/parcours.schema'

const props = defineProps<{ item?: Parcours | null }>()
const emit = defineEmits<{ saved: [] }>()

const open = defineModel<boolean>('open', { default: false })
const toast = useAppToast()
const saving = ref(false)

const isEdit = computed(() => !!props.item)

const defaultState = (): ParcoursCreateInput => ({
  role: '',
  place: '',
  period: '',
  description: '',
  isActive: true,
})

const formState = reactive<ParcoursCreateInput>(defaultState())

watch(open, (isOpen) => {
  if (isOpen && !props.item) Object.assign(formState, defaultState())
})

watch(() => props.item, (item) => {
  if (item) {
    formState.role = item.role
    formState.place = item.place
    formState.period = item.period
    formState.description = item.description ?? ''
    formState.isActive = item.isActive
  }
  else {
    Object.assign(formState, defaultState())
  }
}, { immediate: true })

async function onSubmit(event: FormSubmitEvent<ParcoursCreateInput>) {
  saving.value = true
  try {
    if (isEdit.value && props.item) {
      await $fetch(`/api/parcours/${props.item.id}`, { method: 'PUT', body: event.data })
      toast.success('Entrée mise à jour')
    }
    else {
      await $fetch('/api/parcours', { method: 'POST', body: event.data })
      toast.success('Entrée ajoutée')
    }
    open.value = false
    emit('saved')
  }
  catch {
    toast.error('Erreur', 'Impossible de sauvegarder')
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="isEdit ? 'Modifier l\'entrée' : 'Ajouter une entrée'"
    side="right"
    inset
  >
    <template #body>
      <UForm
        id="parcours-form"
        :schema="parcoursCreateSchema"
        :state="formState"
        class="flex flex-col gap-5 p-4"
        @submit="onSubmit"
      >
        <UFormField name="role" label="Rôle / Titre" required>
          <UInput v-model="formState.role" placeholder="Développeur Full-Stack" class="w-full" />
        </UFormField>

        <UFormField name="place" label="Entreprise / Lieu" required>
          <UInput v-model="formState.place" placeholder="Freelance, Entreprise XYZ…" class="w-full" />
        </UFormField>

        <UFormField name="period" label="Période" required hint="Texte libre, ex: 2023 — Aujourd'hui">
          <UInput v-model="formState.period" placeholder="2023 — Aujourd'hui" class="w-full" />
        </UFormField>

        <UFormField name="description" label="Description" hint="Optionnel — max 300 caractères">
          <UTextarea v-model="formState.description" placeholder="Décrivez en une phrase ce que vous faites ici." :rows="3" class="w-full" />
        </UFormField>

        <UFormField name="isActive" label="Visible sur le portfolio">
          <div class="flex items-center gap-3">
            <USwitch v-model="formState.isActive" />
            <span class="text-sm text-muted">{{ formState.isActive ? 'Visible' : 'Masqué' }}</span>
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
          form="parcours-form"
          type="submit"
          :loading="saving"
        />
      </div>
    </template>
  </USlideover>
</template>
