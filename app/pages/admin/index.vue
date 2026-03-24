<script setup lang="ts">
import type { Message } from '~~/server/db/schema'
import type { BreakdownData } from '~~/server/services/project.views.service'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

type DashboardStats = {
  projects: { active: number, disabled: number }
  messages: { unread: number, total: number, newsletter: number, newSince: number, lastMessage: Message | null }
}

// Last visit tracking — cookie updated after mount
const lastVisit = useCookie<string>('admin_last_visit', { maxAge: 365 * 24 * 60 * 60 })
const since = lastVisit.value

const [{ data: stats }, { data: brevoStats }, { data: viewsBreakdown }] = await Promise.all([
  useFetch<DashboardStats>('/api/dashboard', { query: since ? { since } : {} }),
  useFetch<{ totalContacts: number }>('/api/brevo/stats'),
  useFetch<BreakdownData>('/api/projects/views/breakdown'),
])

onMounted(() => {
  lastVisit.value = new Date().toISOString()
})

</script>

<template>
  <DashboardPanel title="Dashboard">
    <div class="p-6 flex flex-col gap-6">

      <!-- New since last visit banner -->
      <div
        v-if="stats?.messages.newSince"
        class="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-5 py-3"
      >
        <UIcon name="i-lucide-bell" class="size-4 text-primary shrink-0" />
        <p class="text-sm text-default flex-1">
          <span class="font-semibold">{{ stats.messages.newSince }}</span>
          nouveau{{ stats.messages.newSince > 1 ? 'x messages' : ' message' }} depuis votre dernière visite
        </p>
        <UButton label="Voir l'inbox" icon="i-lucide-inbox" size="xs" to="/admin/inbox" />
      </div>

      <!-- Stats grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardStatsCard
          icon="i-lucide-folder-closed"
          label="Projets actifs"
          :value="stats?.projects.active ?? 0"
          :sublabel="stats?.projects.disabled ? `${stats.projects.disabled} désactivé${stats.projects.disabled > 1 ? 's' : ''}` : undefined"
          color="primary"
          to="/admin/projets"
        />
        <DashboardStatsCard
          icon="i-lucide-inbox"
          label="Messages non lus"
          :value="stats?.messages.unread ?? 0"
          :sublabel="`${stats?.messages.total ?? 0} au total`"
          :color="(stats?.messages.unread ?? 0) > 0 ? 'warning' : 'neutral'"
          to="/admin/inbox"
        />
        <DashboardStatsCard
          icon="i-lucide-rss"
          label="Abonnés newsletter"
          :value="stats?.messages.newsletter ?? 0"
          sublabel="via le portfolio"
          color="success"
        />
        <DashboardStatsCard
          icon="i-simple-icons-brevo"
          label="Contacts Brevo"
          :value="brevoStats?.totalContacts ?? '—'"
          sublabel="total Brevo"
          color="success"
        />
      </div>

      <!-- Views chart -->
      <div v-if="viewsBreakdown" class="rounded-xl border border-default bg-elevated/40 p-5">
        <DashboardViewsChart :data="viewsBreakdown" />
      </div>

      <!-- Last message -->
      <div v-if="stats?.messages.lastMessage" class="rounded-xl border border-default bg-elevated/40 p-5 flex flex-col gap-3">
        <p class="text-sm font-semibold text-default">Dernier message reçu</p>
        <div class="flex items-start gap-3">
          <div class="size-8 rounded-full bg-elevated flex items-center justify-center shrink-0">
            <UIcon
              :name="stats.messages.lastMessage.type === 'contact' ? 'i-lucide-mail' : 'i-lucide-rss'"
              class="size-4"
              :class="stats.messages.lastMessage.type === 'contact' ? 'text-primary' : 'text-success'"
            />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-medium text-default">
                {{ stats.messages.lastMessage.name ?? stats.messages.lastMessage.email }}
              </span>
              <span class="text-xs text-muted shrink-0">{{ formatDate(stats.messages.lastMessage.createdAt) }}</span>
            </div>
            <p v-if="stats.messages.lastMessage.message" class="text-xs text-muted mt-0.5 truncate">
              {{ stats.messages.lastMessage.message }}
            </p>
            <p v-else class="text-xs text-muted italic mt-0.5">Abonnement newsletter</p>
          </div>
        </div>
        <div class="flex justify-end">
          <UButton label="Ouvrir l'inbox" icon="i-lucide-arrow-right" variant="ghost" color="neutral" size="xs" to="/admin/inbox" />
        </div>
      </div>

    </div>
  </DashboardPanel>
</template>