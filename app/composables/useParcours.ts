import type { Parcours } from '~~/server/db/schema'
import type { ParcoursCreateInput, ParcoursUpdateInput } from '#shared/schemas/parcours.schema'

export function useParcours() {
  const toast = useAppToast()
  const { data, refresh, status } = useFetch<Parcours[]>('/api/parcours', { key: 'parcours' })

  const items = computed(() =>
    [...(data.value ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  )

  async function onReorder(sorted: Parcours[]) {
    await $fetch('/api/parcours/reorder', {
      method: 'PATCH',
      body: { items: sorted.map((p, index) => ({ id: p.id, order: index })) },
    })
  }

  async function create(payload: ParcoursCreateInput): Promise<void> {
    await $fetch('/api/parcours', { method: 'POST', body: payload })
    await refresh()
  }

  async function update(id: number, payload: ParcoursUpdateInput): Promise<void> {
    await $fetch(`/api/parcours/${id}`, { method: 'PUT', body: payload })
    await refresh()
  }

  async function toggle(item: Parcours): Promise<void> {
    await $fetch(`/api/parcours/${item.id}`, { method: 'PUT', body: { isActive: !item.isActive } })
    await refresh()
  }

  async function remove(item: Parcours): Promise<void> {
    await $fetch(`/api/parcours/${item.id}`, { method: 'DELETE' })
    await refresh()
    toast.success('Entrée supprimée')
  }

  return { items, refresh, status, onReorder, create, update, toggle, remove }
}
