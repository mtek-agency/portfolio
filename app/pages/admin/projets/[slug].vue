<script setup lang="ts">
import type { Project, ProjectImage } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

type ProjectWithImages = Project & { images: ProjectImage[] }

const route = useRoute()
const toast = useToast()
const slug = computed(() => route.params.slug as string)
const saving = ref(false)

const { data: project, refresh } = await useFetch<ProjectWithImages>(
  () => `/api/projects/${slug.value}`,
  { watch: [slug] },
)

if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })

useKeyboardShortcut('s', () => {
  document.getElementById('project-form')?.requestSubmit()
}, { meta: true })

async function onSaved(updated: Project) {
  if (updated.slug !== slug.value) {
    await navigateTo(`/admin/projets/${updated.slug}`)
  }
  else {
    await refresh()
    toast.add({ title: 'Projet mis à jour', color: 'success', icon: 'i-lucide-check' })
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
        icon="i-lucide-save"
        form="project-form"
        type="submit"
        :loading="saving"
      >
        Sauvegarder
        <template #trailing>
          <span class="flex items-center gap-0.5 opacity-60 ml-0.5">
            <UKbd
                value="meta"
                size="sm"
                color="neutral"
                variant="subtle"
            />
            <UKbd
                value="S"
                size="sm"
                color="neutral"
                variant="subtle"
            />
          </span>
        </template>
      </UButton>
    </template>

    <div class="p-6 flex flex-col gap-6">
      <ProjectsInfoCard :project="project!" />

      <ProjectsForm :project="project!" @saved="onSaved" @update:saving="saving = $event" />

      <USeparator />

      <ProjectsImageGallery
        :images="project?.images ?? []"
        :slug="slug"
        @refresh="refresh"
      />
    </div>
  </DashboardPanel>
</template>