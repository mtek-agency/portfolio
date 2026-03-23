import type { NavigationMenuItem } from '@nuxt/ui'

export function useAdminNav(unreadCount?: Ref<number | null>, onSelect?: () => void) {
  return computed(() => [
    { label: 'Dashboard', icon: 'i-lucide-house', to: '/admin', onSelect },
    {
      label: 'Boîte de réception',
      icon: 'i-lucide-inbox',
      to: '/admin/inbox',
      badge: unreadCount?.value ? String(unreadCount.value) : undefined,
      onSelect,
    },
    { label: 'Projets', icon: 'i-lucide-folder-closed', to: '/admin/projets', onSelect },
  ] satisfies NavigationMenuItem[])
}