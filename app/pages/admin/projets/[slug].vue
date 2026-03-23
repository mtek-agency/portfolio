<script setup lang="ts">
import type { Project, ProjectImage } from '~~/server/db/schema'
import { projectEditSchema } from '~~/shared/schemas/project.schema'
import type { FormSubmitEvent } from '#ui/types'
import type { ProjectEditInput } from '~~/shared/schemas/project.schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

type ProjectWithImages = Project & { images: ProjectImage[] }

const route = useRoute()
const toast = useToast()
const slug = computed(() => route.params.slug as string)

const { data: project, refresh } = await useFetch<ProjectWithImages>(
  () => `/api/projects/${slug.value}`,
  { watch: [slug] },
)

if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })

// ─── Formulaire ──────────────────────────────────────────────────────────────
const formState = reactive<ProjectEditInput>({
  name: project.value.name,
  description: project.value.description,
  year: project.value.year,
  slug: project.value.slug,
  urlWebsite: project.value.urlWebsite ?? '',
  urlRepository: project.value.urlRepository ?? '',
  tags: project.value.tags ?? '',
  stack: project.value.stack ?? '',
  isDisabled: project.value.isDisabled,
})

const saving = ref(false)

async function onSubmit(event: FormSubmitEvent<ProjectEditInput>) {
  saving.value = true
  try {
    const updated = await $fetch<Project>(`/api/projects/${slug.value}`, {
      method: 'PUT',
      body: event.data,
    })
    if (updated.slug !== slug.value) {
      await navigateTo(`/admin/projets/${updated.slug}`)
    }
    else {
      await refresh()
      toast.add({ title: 'Projet mis à jour', color: 'success', icon: 'i-lucide-check' })
    }
  }
  catch {
    toast.add({ title: 'Erreur', description: 'Impossible de mettre à jour le projet', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    saving.value = false
  }
}

// ─── Images ──────────────────────────────────────────────────────────────────
const fileInput = ref<HTMLInputElement>()
const uploadingImages = ref(false)
const deletingImageId = ref<number | null>(null)

async function onFilesSelected(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files?.length) return

  uploadingImages.value = true
  try {
    const formData = new FormData()
    for (const file of files) formData.append('images', file)

    await $fetch(`/api/projects/${slug.value}/images`, { method: 'POST', body: formData })
    await refresh()
    toast.add({ title: `${files.length} image${files.length > 1 ? 's' : ''} ajoutée${files.length > 1 ? 's' : ''}`, color: 'success', icon: 'i-lucide-check' })
  }
  catch {
    toast.add({ title: 'Erreur upload', description: 'Impossible d\'uploader les images', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    uploadingImages.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function deleteImage(image: ProjectImage) {
  deletingImageId.value = image.id
  try {
    await $fetch(`/api/images/${image.id}`, { method: 'DELETE' })
    await refresh()
  }
  catch {
    toast.add({ title: 'Erreur', description: 'Impossible de supprimer l\'image', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    deletingImageId.value = null
  }
}
</script>

<template>
  <DashboardPanel :title="project?.name ?? 'Projet'">
    <template #right>
      <UButton
        label="Retour"
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        to="/admin/projets"
      />
      <UButton
        label="Sauvegarder"
        icon="i-lucide-save"
        :loading="saving"
        form="project-form"
        type="submit"
      />
    </template>

    <div class="p-6 max-w-3xl mx-auto flex flex-col gap-8">
      <!-- Formulaire principal -->
      <UForm
        id="project-form"
        :schema="projectEditSchema"
        :state="formState"
        class="flex flex-col gap-6"
        @submit="onSubmit"
      >
        <!-- Informations principales -->
        <div class="flex flex-col gap-4">
          <p class="text-sm font-semibold text-default">Informations</p>

          <UFormField name="name" label="Nom" required>
            <UInput v-model="formState.name" placeholder="Nom du projet" class="w-full" />
          </UFormField>

          <UFormField name="description" label="Description" required>
            <UTextarea
              v-model="formState.description"
              placeholder="Décrivez votre projet…"
              :rows="4"
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

        <USeparator />

        <!-- Liens -->
        <div class="flex flex-col gap-4">
          <p class="text-sm font-semibold text-default">Liens</p>

          <div class="grid grid-cols-2 gap-4">
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
        </div>

        <USeparator />

        <!-- Mots-clés -->
        <div class="flex flex-col gap-4">
          <p class="text-sm font-semibold text-default">Mots-clés</p>

          <UFormField name="tags" label="Tags" hint="Séparés par des virgules">
            <UInput
              v-model="formState.tags"
              placeholder="nuxt, vue, typescript"
              class="w-full"
            />
          </UFormField>

          <UFormField name="stack" label="Stack technique" hint="Séparés par des virgules">
            <UInput
              v-model="formState.stack"
              placeholder="Nuxt 3, TailwindCSS, Drizzle ORM"
              class="w-full"
            />
          </UFormField>
        </div>

        <USeparator />

        <!-- Paramètres -->
        <div class="flex flex-col gap-4">
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
      </UForm>

      <USeparator />

      <!-- Images -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-default">
            Images
            <span class="text-muted font-normal ml-1">({{ project?.images?.length ?? 0 }})</span>
          </p>
          <UButton
            label="Ajouter des images"
            icon="i-lucide-upload"
            variant="outline"
            size="sm"
            :loading="uploadingImages"
            @click="fileInput?.click()"
          />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="onFilesSelected"
          />
        </div>

        <div v-if="project?.images?.length" class="grid grid-cols-3 gap-3">
          <div
            v-for="image in project.images"
            :key="image.id"
            class="relative group rounded-lg overflow-hidden aspect-video bg-elevated"
          >
            <img
              :src="`/api/images/${image.filename}`"
              :alt="image.filename"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="sm"
                :loading="deletingImageId === image.id"
                @click="deleteImage(image)"
              />
            </div>
          </div>
        </div>

        <div v-else class="rounded-lg border border-dashed border-default flex flex-col items-center justify-center gap-2 py-10 text-center">
          <UIcon name="i-lucide-image" class="size-8 text-muted" />
          <p class="text-sm text-muted">Aucune image pour ce projet</p>
          <UButton
            label="Ajouter des images"
            variant="ghost"
            size="sm"
            @click="fileInput?.click()"
          />
        </div>
      </div>
    </div>
  </DashboardPanel>
</template>