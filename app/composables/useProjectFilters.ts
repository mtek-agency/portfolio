import type { Project } from '~~/server/db/schema'

export type ProjectWithImageCount = Project & { images: { id: number }[] }

export function useProjectFilters(projects: Ref<ProjectWithImageCount[]>) {
  const search = ref('')
  const statusFilter = ref<'all' | 'active' | 'disabled'>('all')

  const statusOptions = [
    { label: 'Tous les projets', value: 'all' },
    { label: 'Actifs', value: 'active' },
    { label: 'Désactivés', value: 'disabled' },
  ]

  const filteredProjects = computed(() => {
    let list = projects.value

    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q)
        || p.slug.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q),
      )
    }

    if (statusFilter.value === 'active') list = list.filter(p => !p.isDisabled)
    else if (statusFilter.value === 'disabled') list = list.filter(p => p.isDisabled)

    return list
  })

  const activeCount = computed(() => projects.value.filter(p => !p.isDisabled).length)
  const disabledCount = computed(() => projects.value.filter(p => p.isDisabled).length)

  return { search, statusFilter, statusOptions, filteredProjects, activeCount, disabledCount }
}