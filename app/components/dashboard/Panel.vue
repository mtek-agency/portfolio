<script setup lang="ts">
import type { BreadcrumbItem } from '#ui/types'

defineProps<{
  title?: string
  breadcrumb?: BreadcrumbItem[]
}>()
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar :title="breadcrumb ? undefined : (title ?? 'Admin')" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template v-if="breadcrumb" #title>
          <UBreadcrumb :items="breadcrumb" />
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
