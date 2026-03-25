<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router'
import type { Project, ProjectImage } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  pageTransition: false,
})

type ProjectWithImages = Project & { images: ProjectImage[], views: number }

const route = useRoute()
const toast = useAppToast()
const slug = computed(() => route.params.slug as string)
const saving = ref(false)
const dirty = ref(false)

const { data: project, refresh } = await useFetch<ProjectWithImages>(
  () => `/api/projects/${slug.value}`,
  { key: computed(() => `project-${slug.value}`), watch: [slug] },
)

if (!project.value) throw createError({ statusCode: 404, statusMessage: 'Projet introuvable' })

useHead({ title: computed(() => project.value?.name ?? 'Projet') })

const deleteConfirm = useDeleteConfirm<Project>()

useKeyboardShortcut('s', () => document.getElementById('project-form')?.requestSubmit(), { meta: true })

async function onSaved(updated: Project) {
  if (updated.slug !== slug.value) {
    await navigateTo(`/admin/projets/${updated.slug}`)
  }
  else {
    await refresh()
    toast.success('Projet mis à jour')
  }
}

onBeforeRouteLeave(() => {
  if (dirty.value) {
    return window.confirm('Vous avez des modifications non sauvegardées. Quitter quand même ?')
  }
})

async function deleteProject(p: Project) {
  await $fetch(`/api/projects/${p.slug}`, { method: 'DELETE' })
  dirty.value = false
  await navigateTo('/admin/projets')
}
</script>

<template>
  <DashboardPanel :breadcrumb="[{ label: 'Projets', to: '/admin/projets' }, { label: project?.name ?? 'Projet' }]">
    <template #right>
      <span v-if="dirty" class="flex items-center gap-1.5 text-xs text-warning font-medium mr-1">
        <span class="size-1.5 rounded-full bg-warning animate-pulse" />
        Non sauvegardé
      </span>
      <UButton label="Retour" icon="i-lucide-arrow-left" variant="ghost" color="neutral" to="/admin/projets" />
      <UButton icon="i-lucide-save" form="project-form" type="submit" :loading="saving">
        Sauvegarder
        <template #trailing>
          <span class="flex items-center gap-0.5 opacity-60 ml-0.5">
            <UKbd value="meta" size="sm" color="neutral" variant="subtle" />
            <UKbd value="S" size="sm" color="neutral" variant="subtle" />
          </span>
        </template>
      </UButton>
    </template>

    <div class="p-6 flex flex-col gap-6">
      <ProjectsInfoCard :project="project!" />

      <ProjectsForm
        :project="project!"
        @saved="onSaved"
        @update:saving="saving = $event"
        @update:dirty="dirty = $event"
      />

      <USeparator />

      <ProjectsImageGallery :images="project?.images ?? []" :slug="slug" @refresh="refresh" />

      <USeparator />

      <!-- Zone de danger -->
      <div class="rounded-xl border border-error/30 bg-error/5 p-5 flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-default">Supprimer le projet</p>
          <p class="text-sm text-muted mt-0.5">Action irréversible — toutes les images seront supprimées.</p>
        </div>
        <UButton label="Supprimer" icon="i-lucide-trash-2" color="error" variant="soft" @click="deleteConfirm.request(project!)" />
      </div>
    </div>
  </DashboardPanel>

  <UiConfirmDeleteModal
    v-model:open="deleteConfirm.open.value"
    :title="`Supprimer « ${deleteConfirm.item.value?.name} » ?`"
    description="Action irréversible — toutes les images seront supprimées."
    :loading="deleteConfirm.loading.value"
    @confirm="deleteConfirm.confirm(deleteProject)"
    @cancel="deleteConfirm.cancel()"
  />
</template>
