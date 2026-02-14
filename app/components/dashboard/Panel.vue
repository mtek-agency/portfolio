<script setup lang="ts">
defineProps<{
  title?: string
}>()

</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :title="title ?? 'Admin'" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <slot name="right" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <slot>
        <div class="text-muted text-sm">
          No content provided
        </div>
      </slot>
    </template>
  </UDashboardPanel>
</template>
