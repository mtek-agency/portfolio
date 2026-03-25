<script setup lang="ts">
import type { Message } from '~~/server/db/schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  pageTransition: false,
})

useHead({ title: 'Inbox' })

const { refresh, unreadCount, contactCount, newsletterCount, activeFilter, filterOptions, filteredMessages, markAsRead, markAllRead } = useInboxMessages()
const { data: brevoStats } = useFetch<{ totalContacts: number }>('/api/brevo/stats', { key: 'brevo-stats' })

const { brevoUrl, loadingBrevo, fetchBrevoContact } = useBrevoContact()

const selectedMessage = ref<Message | null>(null)
const slideoverOpen = ref(false)
const markingAllRead = ref(false)

async function openMessage(message: Message) {
  selectedMessage.value = message
  slideoverOpen.value = true
  await Promise.all([
    message.isRead ? null : markAsRead(message).then(updated => { selectedMessage.value = updated }),
    fetchBrevoContact(message.email),
  ])
}

async function onMarkAllRead() {
  markingAllRead.value = true
  try {
    await markAllRead()
  }
  finally {
    markingAllRead.value = false
  }
}
</script>

<template>
  <DashboardPanel title="Boîte de réception">
    <template #right>
      <UButton
        v-if="unreadCount > 0"
        label="Tout marquer lu"
        icon="i-lucide-check-check"
        variant="ghost"
        color="neutral"
        size="sm"
        :loading="markingAllRead"
        @click="onMarkAllRead"
      />
      <UButton icon="i-lucide-refresh-cw" variant="ghost" color="neutral" size="sm" @click="() => refresh()" />
    </template>

    <div class="flex flex-col h-full">
      <InboxStatsBar
        :unread-count="unreadCount"
        :contact-count="contactCount"
        :newsletter-count="newsletterCount"
        :brevo-total="brevoStats?.totalContacts"
      />

      <div class="flex items-center gap-1 px-4 py-2 border-b border-default">
        <UButton
          v-for="opt in filterOptions"
          :key="opt.value"
          :label="opt.label"
          size="xs"
          :variant="activeFilter === opt.value ? 'soft' : 'ghost'"
          :color="activeFilter === opt.value ? 'primary' : 'neutral'"
          @click="activeFilter = opt.value"
        />
        <span class="ml-auto text-xs text-muted">
          {{ filteredMessages.length }} message{{ filteredMessages.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <div class="flex-1 overflow-y-auto divide-y divide-default">
        <InboxMessageItem
          v-for="message in filteredMessages"
          :key="message.id"
          :message="message"
          @click="openMessage"
        />
        <div v-if="filteredMessages.length === 0" class="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <UIcon name="i-lucide-inbox" class="size-8 text-muted" />
          <p class="text-sm text-muted">Aucun message</p>
        </div>
      </div>

    </div>

    <InboxMessageSlideover
      v-model:open="slideoverOpen"
      :message="selectedMessage"
      :brevo-url="brevoUrl"
      :loading-brevo="loadingBrevo"
    />
  </DashboardPanel>
</template>