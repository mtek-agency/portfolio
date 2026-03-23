import type { Project } from '~~/server/db/schema'

export function useProjectToggle(refresh: () => Promise<void>) {
  const togglingId = ref<number | null>(null)

  async function toggleDisable(project: Project) {
    if (togglingId.value !== null) return
    togglingId.value = project.id
    try {
      await $fetch(`/api/projects/${project.slug}/disable`, {
        method: 'PATCH',
        body: { isDisabled: !project.isDisabled },
      })
      await refresh()
    }
    finally {
      togglingId.value = null
    }
  }

  return { togglingId, toggleDisable }
}
