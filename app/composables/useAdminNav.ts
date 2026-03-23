import type { NavigationMenuItem } from '@nuxt/ui'

export function useAdminNav(onSelect?: () => void) {
  return [
    { label: 'Dashboard', icon: 'i-lucide-house', to: '/admin', onSelect },
    { label: 'Boîte de réception', icon: 'i-lucide-inbox', to: '/inbox', badge: '4', onSelect },
    { label: 'Projets', icon: 'i-lucide-folder-closed', to: '/admin/projets', onSelect },
  ] satisfies NavigationMenuItem[]
}