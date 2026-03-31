import type { NavigationMenuItem } from '@nuxt/ui'

export function useAdminNav(unreadCount?: Ref<number | null>, onSelect?: () => void) {
  return computed(() => [
    [
      { label: 'Dashboard', icon: 'i-lucide-house', to: '/admin', onSelect },
      {
        label: 'Boîte de réception',
        icon: 'i-lucide-inbox',
        to: '/admin/inbox',
        badge: unreadCount?.value ? String(unreadCount.value) : undefined,
        onSelect,
      },
    ],
    [
      { type: 'label', label: 'Contenu' },
      { label: 'Projets', icon: 'i-lucide-folder-closed', to: '/admin/projets', onSelect },
      { label: 'Blog', icon: 'i-lucide-notebook-pen', to: '/admin/blog', onSelect },
      { label: 'Outils', icon: 'i-lucide-layout-grid', to: '/admin/tools', onSelect },
      { label: 'Parcours', icon: 'i-lucide-briefcase', to: '/admin/parcours', onSelect },
    ],
    [
      { type: 'label', label: 'Analyse' },
      { label: 'Stats', icon: 'i-lucide-bar-chart-2', to: '/admin/stats', onSelect },
    ],
  ] satisfies NavigationMenuItem[][])
}
