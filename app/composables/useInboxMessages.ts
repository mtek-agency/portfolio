import type { Message } from '~~/server/db/schema'

type Filter = 'all' | 'unread' | 'contact' | 'newsletter'

export function useInboxMessages() {
  const { data: messages, refresh, status } = useFetch<Message[]>('/api/messages', { key: 'messages' })

  const unreadCount = computed(() => messages.value?.filter(m => !m.isRead).length ?? 0)
  const contactCount = computed(() => messages.value?.filter(m => m.type === 'contact').length ?? 0)
  const newsletterCount = computed(() => messages.value?.filter(m => m.type === 'newsletter').length ?? 0)

  const activeFilter = ref<Filter>('all')

  const filterOptions: { label: string, value: Filter }[] = [
    { label: 'Tous', value: 'all' },
    { label: 'Non lus', value: 'unread' },
    { label: 'Contact', value: 'contact' },
    { label: 'Newsletter', value: 'newsletter' },
  ]

  const filteredMessages = computed(() => {
    const list = messages.value ?? []
    if (activeFilter.value === 'unread') return list.filter(m => !m.isRead)
    if (activeFilter.value === 'contact') return list.filter(m => m.type === 'contact')
    if (activeFilter.value === 'newsletter') return list.filter(m => m.type === 'newsletter')
    return list
  })

  async function markAsRead(message: Message): Promise<Message> {
    await $fetch(`/api/messages/${message.id}/read`, { method: 'PATCH' })
    if (messages.value) {
      messages.value = messages.value.map(m => m.id === message.id ? { ...m, isRead: true } : m)
    }
    await refreshNuxtData('inbox-unread')
    return { ...message, isRead: true }
  }

  async function markAllRead(): Promise<void> {
    await $fetch('/api/messages/read-all', { method: 'PATCH' })
    if (messages.value) {
      messages.value = messages.value.map(m => ({ ...m, isRead: true }))
    }
    await refreshNuxtData('inbox-unread')
  }

  return {
    messages,
    refresh,
    status,
    unreadCount,
    contactCount,
    newsletterCount,
    activeFilter,
    filterOptions,
    filteredMessages,
    markAsRead,
    markAllRead,
  }
}
