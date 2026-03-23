<script setup lang="ts">
defineProps<{
  unreadCount: number
  contactCount: number
  newsletterCount: number
  brevoTotal?: number | null
}>()
</script>

<template>
  <div class="flex items-center gap-6 px-4 py-3 border-b border-default text-sm text-muted flex-wrap">
    <span>
      <span class="font-semibold text-default">{{ unreadCount }}</span>
      non lu{{ unreadCount !== 1 ? 's' : '' }}
    </span>
    <span class="text-default/20">·</span>
    <span>
      <span class="font-semibold text-default">{{ contactCount }}</span>
      contact{{ contactCount !== 1 ? 's' : '' }}
    </span>
    <span class="text-default/20">·</span>
    <span>
      <span class="font-semibold text-default">{{ newsletterCount }}</span>
      abonné{{ newsletterCount !== 1 ? 's' : '' }}
    </span>
    <template v-if="brevoTotal != null">
      <span class="text-default/20">·</span>
      <span class="flex items-center gap-1.5">
        <UIcon name="i-simple-icons-brevo" class="size-3.5 text-[#0B996E]" />
        <span class="font-semibold text-default">{{ brevoTotal }}</span>
        contact{{ brevoTotal !== 1 ? 's' : '' }} Brevo
      </span>
    </template>
  </div>
</template>