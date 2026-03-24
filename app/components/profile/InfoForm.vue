<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'
import { profileUpdateSchema } from '#shared/schemas/user.schema'
import type { ProfileUpdateInput } from '#shared/schemas/user.schema'

const props = defineProps<{
  name: string
  email: string
  saving: boolean
}>()

const emit = defineEmits<{ submit: [ProfileUpdateInput] }>()

const state = reactive<ProfileUpdateInput>({
  name: props.name,
  email: props.email,
})

watch(() => [props.name, props.email], ([name, email]) => {
  state.name = name
  state.email = email
})

function onSubmit(event: FormSubmitEvent<ProfileUpdateInput>) {
  emit('submit', event.data)
}
</script>

<template>
  <div>
    <h2 class="text-sm font-semibold text-default mb-4">Informations</h2>
    <UForm
      id="profile-form"
      :schema="profileUpdateSchema"
      :state="state"
      class="flex flex-col gap-4"
      @submit="onSubmit"
    >
      <UFormField name="name" label="Nom">
        <UInput v-model="state.name" placeholder="Mon nom" class="w-full" />
      </UFormField>
      <UFormField name="email" label="Email">
        <UInput v-model="state.email" type="email" placeholder="moi@exemple.com" class="w-full" />
      </UFormField>
      <div class="flex justify-end">
        <UButton label="Enregistrer" icon="i-lucide-check" type="submit" form="profile-form" :loading="saving" />
      </div>
    </UForm>
  </div>
</template>
