<script setup lang="ts">
import type { Project } from '~~/server/db/schema'
import { minimalCreateProjectSchema } from '~~/shared/schemas/project.schema'

const open = defineModel<boolean>('open', { default: false })

const creating = ref(false)
const isAutoSlug = ref(true)
const createState = reactive({ name: '', slug: '' })

watch(() => createState.name, (val) => {
  if (isAutoSlug.value) createState.slug = toSlug(val)
})

watch(open, (val) => {
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
    open.value = false
    await navigateTo(`/admin/projets/${project.slug}`)
  }
  finally {
    creating.value = false
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
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
            class="w-full font-mono"
            @update:model-value="isAutoSlug = false"
          />
        </UFormField>

        <div class="pt-2 flex gap-3 justify-end">
          <UButton label="Annuler" variant="ghost" color="neutral" @click="open = false" />
          <UButton type="submit" label="Créer le projet" :loading="creating" icon="i-lucide-plus" />
        </div>
      </UForm>
    </template>
  </USlideover>
</template>
