<script setup lang="ts">
const open = ref(false)
const { data: unreadCount } = await useAsyncData('inbox-unread', () => $fetch<number>('/api/messages/unread-count'))
const links = useAdminNav(unreadCount, () => { open.value = false })
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
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links"
          orientation="vertical"
          tooltip
          popover
        />
      </template>

      <template #footer="{ collapsed }">
        <DashboardUserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <slot />
  </UDashboardGroup>
</template>