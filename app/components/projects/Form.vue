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
  'update:dirty': [value: boolean]
}>()

const toast = useAppToast()
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
  metaTitle: props.project.metaTitle ?? '',
  metaDescription: props.project.metaDescription ?? '',
})

const isDirty = computed(() =>
  formState.name !== props.project.name
  || formState.description !== props.project.description
  || formState.year !== props.project.year
  || formState.slug !== props.project.slug
  || formState.urlWebsite !== (props.project.urlWebsite ?? '')
  || formState.urlRepository !== (props.project.urlRepository ?? '')
  || formState.tags !== (props.project.tags ?? '')
  || formState.stack !== (props.project.stack ?? '')
  || formState.isDisabled !== props.project.isDisabled
  || formState.metaTitle !== (props.project.metaTitle ?? '')
  || formState.metaDescription !== (props.project.metaDescription ?? ''),
)

watch(isDirty, val => emit('update:dirty', val))

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
    toast.error('Erreur', 'Impossible de mettre à jour le projet')
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
          <div class="flex gap-2">
            <UInput v-model="formState.slug" placeholder="mon-projet" class="flex-1 font-mono" />
            <UTooltip text="Régénérer depuis le nom">
              <UButton
                icon="i-lucide-refresh-cw"
                size="sm"
                variant="ghost"
                color="neutral"
                type="button"
                @click="formState.slug = toSlug(formState.name)"
              />
            </UTooltip>
          </div>
        </UFormField>
      </div>
    </div>

    <!-- Colonne droite : Liens + Mots-clés + Paramètres -->
    <div class="flex flex-col gap-4">
      <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
        <p class="text-sm font-semibold text-default">Liens</p>

        <UFormField name="urlWebsite" label="Site web">
          <UInput v-model="formState.urlWebsite" placeholder="https://…" leading-icon="i-lucide-globe" class="w-full" />
        </UFormField>

        <UFormField name="urlRepository" label="Dépôt">
          <UInput v-model="formState.urlRepository" placeholder="https://github.com/…" leading-icon="i-lucide-github" class="w-full" />
        </UFormField>
      </div>

      <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
        <p class="text-sm font-semibold text-default">Mots-clés</p>

        <UFormField name="tags" label="Tags" hint="Séparés par des virgules">
          <UInput v-model="formState.tags" placeholder="nuxt, vue, typescript" class="w-full" />
        </UFormField>

        <UFormField name="stack" label="Stack technique" hint="Séparés par des virgules">
          <UInput v-model="formState.stack" placeholder="Nuxt 3, TailwindCSS, Drizzle ORM" class="w-full" />
        </UFormField>
      </div>

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

      <div class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-4">
        <p class="text-sm font-semibold text-default">SEO</p>

        <UFormField name="metaTitle" label="Meta title" :hint="`${formState.metaTitle?.length ?? 0}/60`">
          <UInput
            v-model="formState.metaTitle"
            placeholder="Titre pour Google…"
            class="w-full"
            :ui="{ trailing: 'pointer-events-none' }"
          />
          <p class="text-xs text-muted mt-1">Par défaut : nom du projet</p>
        </UFormField>

        <UFormField name="metaDescription" label="Meta description" :hint="`${formState.metaDescription?.length ?? 0}/160`">
          <UTextarea
            v-model="formState.metaDescription"
            placeholder="Description pour Google…"
            :rows="3"
            autoresize
            class="w-full"
          />
          <p class="text-xs text-muted mt-1">Par défaut : description du projet</p>
        </UFormField>

      </div>
    </div>
  </UForm>
</template>