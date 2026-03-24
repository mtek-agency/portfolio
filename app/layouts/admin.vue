<script setup lang="ts">
const open = ref(false)
const { data: unreadCount } = await useAsyncData('inbox-unread', () => $fetch<number>('/api/messages/unread-count'))
const links = useAdminNav(unreadCount, () => { open.value = false })
const { open: openCmd } = useCommandPalette()
useKeyboardShortcut('k', openCmd, { meta: true })
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <NuxtLink v-if="!collapsed" to="/admin" class="flex flex-col gap-1 px-1 select-none">
          <span class="text-2xl font-bold tracking-[0.15em] uppercase text-highlighted leading-none">MTEK</span>
          <div class="flex items-center gap-2">
            <div class="h-px flex-1 bg-default" />
            <span class="text-[9px] tracking-[0.25em] uppercase text-muted font-medium">studio</span>
          </div>
        </NuxtLink>
        <NuxtLink v-else to="/admin" class="flex items-center justify-center mx-auto select-none">
          <span class="text-xl font-bold tracking-[0.15em] uppercase text-highlighted leading-none">M</span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <div class="px-2 mb-1">
          <UTooltip v-if="collapsed" text="Rechercher" :shortcuts="['⌘', 'K']" side="right">
            <UButton
              icon="i-lucide-search"
              variant="ghost"
              color="neutral"
              block
              @click="openCmd"
            />
          </UTooltip>
          <button
            v-else
            class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border border-default bg-elevated/40 hover:bg-elevated transition-colors text-sm text-muted"
            @click="openCmd"
          >
            <UIcon name="i-lucide-search" class="size-3.5 shrink-0" />
            <span class="flex-1 text-left">Rechercher…</span>
            <div class="flex items-center gap-0.5">
              <UKbd value="meta" size="sm" color="neutral" variant="subtle" />
              <UKbd value="K" size="sm" color="neutral" variant="subtle" />
            </div>
          </button>
        </div>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
          tooltip
          popover
        />
        <div class="mt-auto pt-2">
          <UTooltip v-if="collapsed" text="Retourner au site" side="right">
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              color="neutral"
              block
              to="/"
            />
          </UTooltip>
          <UButton
            v-else
            icon="i-lucide-arrow-left"
            label="Retourner au site"
            variant="soft"
            color="neutral"
            block
            to="/"
          />
        </div>
      </template>

      <template #footer="{ collapsed }">
          <DashboardUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <slot />
    <DashboardCommandPalette />
  </UDashboardGroup>
</template>