<script setup lang="ts">
import type { Message } from '~~/server/db/schema'

defineProps<{ message: Message }>()
defineEmits<{ click: [message: Message] }>()

</script>

<template>
  <div
    class="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-elevated/50 transition-colors"
    :class="{ 'bg-primary/5': !message.isRead }"
    @click="$emit('click', message)"
  >
    <!-- Unread dot -->
    <div class="mt-1.5 size-2 rounded-full shrink-0" :class="message.isRead ? 'bg-transparent' : 'bg-primary'" />

    <!-- Icon -->
    <div class="size-8 rounded-full bg-elevated flex items-center justify-center shrink-0">
      <UIcon
        :name="message.type === 'contact' ? 'i-lucide-mail' : 'i-lucide-rss'"
        class="size-4"
        :class="message.type === 'contact' ? 'text-primary' : 'text-success'"
      />
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center justify-between gap-2">
        <span class="text-sm font-medium text-default truncate">
          {{ message.name ?? message.email }}
        </span>
        <span class="text-xs text-muted shrink-0">{{ formatDateShort(message.createdAt) }}</span>
      </div>
      <div class="flex items-center gap-2 mt-0.5">
        <UBadge
          :label="message.type === 'contact' ? 'Contact' : 'Newsletter'"
          :color="message.type === 'contact' ? 'primary' : 'success'"
          variant="subtle"
          size="xs"
        />
        <span v-if="message.message" class="text-xs text-muted truncate">{{ message.message }}</span>
        <span v-else class="text-xs text-muted italic">Abonnement newsletter</span>
      </div>
    </div>
  </div>
</template>