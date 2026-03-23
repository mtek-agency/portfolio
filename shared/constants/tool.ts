export const TOOL_CATEGORY_IDS = ['dev', 'design', 'hosting', 'analytics', 'social', 'productivity', 'other'] as const
export type ToolCategoryId = typeof TOOL_CATEGORY_IDS[number]

export const TOOL_CATEGORIES: { id: ToolCategoryId, label: string, icon: string }[] = [
  { id: 'dev', label: 'Dev & Code', icon: 'i-lucide-code-2' },
  { id: 'design', label: 'Design', icon: 'i-lucide-pen-tool' },
  { id: 'hosting', label: 'Hosting & Cloud', icon: 'i-lucide-cloud' },
  { id: 'analytics', label: 'Analytics', icon: 'i-lucide-bar-chart-2' },
  { id: 'social', label: 'Réseaux sociaux', icon: 'i-lucide-share-2' },
  { id: 'productivity', label: 'Productivité', icon: 'i-lucide-zap' },
  { id: 'other', label: 'Autres', icon: 'i-lucide-grid-2x2' },
]