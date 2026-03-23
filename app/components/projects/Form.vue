<script setup lang="ts">
import type { Project } from '~~/server/db/schema'
import { projectEditSchema } from '~~/shared/schemas/project.schema'
import type { FormSubmitEvent } from '#ui/types'
import type { ProjectEditInput } from '~~/shared/schemas/project.schema'

const props = defineProps<{
  project: Project
}>()

const emit = defineEmits<{
  saved: [updated: Project]
  'update:saving': [value: boolean]
}>()

const toast = useToast()
const saving = ref(false)

const formState = reactive<ProjectEditInput>({
  name: props.project.name,
  description: props.project.description,
  year: props.project.year,
  slug: props.project.slug,
  urlWebsite: props.project.urlWebsite ?? '',
  urlRepository: props.project.urlRepository ?? '',
  tags: props.project.tags ?? '',
  stack: props.project.stack ?? '',
  isDisabled: props.project.isDisabled,
})

async function onSubmit(event: FormSubmitEvent<ProjectEditInput>) {
  saving.value = true
  emit('update:saving', true)
  try {
    const updated = await $fetch<Project>(`/api/projects/${props.project.slug}`, {
      method: 'PUT',
      body: event.data,
    })
    emit('saved', updated)
  }
  catch {
    toast.add({ title: 'Erreur', description: 'Impossible de mettre à jour le projet', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    saving.value = false
    emit('update:saving', false)
  }
}
</script>

<template>
  <UForm
    id="project-form"
    :schema="projectEditSchema"
    :state="formState"
    class="grid grid-cols-1 lg:grid-cols-2 gap-4"
    @submit="onSubmit"
  >
    <!-- Colonne gauche : Informations principales -->
    <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
      <p class="text-sm font-semibold text-default">Informations</p>

      <UFormField name="name" label="Nom" required>
        <UInput v-model="formState.name" placeholder="Nom du projet" class="w-full" />
      </UFormField>

      <UFormField name="description" label="Description" required>
        <UTextarea
          v-model="formState.description"
          placeholder="Décrivez votre projet…"
          :rows="10"
          autoresize
          class="w-full"
        />
      </UFormField>

      <div class="grid grid-cols-2 gap-4">
        <UFormField name="year" label="Année" required>
          <UInput v-model="formState.year" placeholder="2026" class="w-full" />
        </UFormField>

        <UFormField name="slug" label="Slug" required>
          <UInput v-model="formState.slug" placeholder="mon-projet" class="w-full font-mono" />
        </UFormField>
      </div>
    </div>

    <!-- Colonne droite : Liens + Mots-clés + Paramètres -->
    <div class="flex flex-col gap-4">
      <!-- Liens -->
      <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
        <p class="text-sm font-semibold text-default">Liens</p>

        <UFormField name="urlWebsite" label="Site web">
          <UInput
            v-model="formState.urlWebsite"
            placeholder="https://…"
            leading-icon="i-lucide-globe"
            class="w-full"
          />
        </UFormField>

        <UFormField name="urlRepository" label="Dépôt">
          <UInput
            v-model="formState.urlRepository"
            placeholder="https://github.com/…"
            leading-icon="i-lucide-github"
            class="w-full"
          />
        </UFormField>
      </div>

      <!-- Mots-clés -->
      <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
        <p class="text-sm font-semibold text-default">Mots-clés</p>

        <UFormField name="tags" label="Tags" hint="Séparés par des virgules">
          <UInput v-model="formState.tags" placeholder="nuxt, vue, typescript" class="w-full" />
        </UFormField>

        <UFormField name="stack" label="Stack technique" hint="Séparés par des virgules">
          <UInput v-model="formState.stack" placeholder="Nuxt 3, TailwindCSS, Drizzle ORM" class="w-full" />
        </UFormField>
      </div>

      <!-- Paramètres -->
      <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
        <p class="text-sm font-semibold text-default">Paramètres</p>

        <UFormField name="isDisabled" label="Désactiver le projet">
          <div class="flex items-center gap-3">
            <USwitch v-model="formState.isDisabled" />
            <span class="text-sm text-muted">
              {{ formState.isDisabled ? 'Le projet est masqué du portfolio' : 'Le projet est visible dans le portfolio' }}
            </span>
          </div>
        </UFormField>
      </div>
    </div>
  </UForm>
</template>