import { TOOL_CATEGORIES, TOOL_CATEGORY_IDS } from '#shared/constants/tool'
import type { Tool } from '~~/server/db/schema'
import type { ToolCreateInput, ToolUpdateInput } from '#shared/schemas/tool.schema'

export type { Tool }

export async function useTools() {
  const toast = useToast()
  const { data: tools, refresh } = await useFetch<Tool[]>('/api/tools')

  // Grouped by category — reactive object for VueDraggable cross-group DnD
  const groupedTools = reactive<Record<string, Tool[]>>(
    Object.fromEntries(TOOL_CATEGORY_IDS.map(id => [id, []]))
  )

  watch(tools, (val) => {
    for (const { id } of TOOL_CATEGORIES) {
      groupedTools[id] = val?.filter(t => t.category === id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) ?? []
    }
  }, { immediate: true })

  async function onReorder() {
    const items = TOOL_CATEGORIES.flatMap(({ id }) =>
      (groupedTools[id] ?? []).map((tool, index) => ({ id: tool.id, category: id, order: index }))
    )
    await $fetch('/api/tools/reorder', { method: 'PATCH', body: { items } })
  }

  async function create(data: ToolCreateInput): Promise<Tool> {
    const tool = await $fetch<Tool>('/api/tools', { method: 'POST', body: data })
    await refresh()
    return tool
  }

  async function update(id: number, data: ToolUpdateInput): Promise<void> {
    await $fetch(`/api/tools/${id}`, { method: 'PUT', body: data })
    await refresh()
  }

  async function toggle(tool: Tool): Promise<void> {
    await $fetch(`/api/tools/${tool.id}/toggle`, { method: 'PATCH' })
    if (groupedTools[tool.category]) {
      const idx = groupedTools[tool.category].findIndex(t => t.id === tool.id)
      if (idx !== -1) groupedTools[tool.category][idx] = { ...tool, isActive: !tool.isActive }
    }
  }

  async function remove(tool: Tool): Promise<void> {
    await $fetch(`/api/tools/${tool.id}`, { method: 'DELETE' })
    if (groupedTools[tool.category]) {
      groupedTools[tool.category] = groupedTools[tool.category].filter(t => t.id !== tool.id)
    }
    toast.add({ title: 'Outil supprimé', color: 'success', icon: 'i-lucide-check' })
  }

  return { tools, groupedTools, refresh, onReorder, create, update, toggle, remove }
}
