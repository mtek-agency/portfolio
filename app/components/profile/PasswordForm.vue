<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { passwordUpdateSchema } from '#shared/schemas/user.schema'
import type { PasswordUpdateInput } from '#shared/schemas/user.schema'

defineProps<{ saving: boolean }>()

const emit = defineEmits<{ submit: [PasswordUpdateInput] }>()

const state = reactive<PasswordUpdateInput>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function onSubmit(event: FormSubmitEvent<PasswordUpdateInput>) {
  emit('submit', event.data)
  state.currentPassword = ''
  state.newPassword = ''
  state.confirmPassword = ''
}
</script>

<template>
  <div>
    <h2 class="text-sm font-semibold text-default mb-4">Changer le mot de passe</h2>
    <UForm
      id="password-form"
      :schema="passwordUpdateSchema"
      :state="state"
      class="flex flex-col gap-4"
      @submit="onSubmit"
    >
      <UFormField name="currentPassword" label="Mot de passe actuel">
        <UInput v-model="state.currentPassword" type="password" class="w-full" />
      </UFormField>
      <UFormField name="newPassword" label="Nouveau mot de passe">
        <UInput v-model="state.newPassword" type="password" class="w-full" />
      </UFormField>
      <UFormField name="confirmPassword" label="Confirmer le mot de passe">
        <UInput v-model="state.confirmPassword" type="password" class="w-full" />
      </UFormField>
      <div class="flex justify-end">
        <UButton label="Mettre à jour" icon="i-lucide-lock" type="submit" form="password-form" :loading="saving" />
      </div>
    </UForm>
  </div>
</template>
