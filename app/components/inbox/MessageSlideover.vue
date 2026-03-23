<script setup lang="ts">
import type { Message } from '~~/server/db/schema'

defineProps<{
  message: Message | null
  brevoUrl: string | null
  loadingBrevo: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

</script>

<template>
  <USlideover v-model:open="open" inset side="right" :ui="{ width: 'max-w-md' }">
    <template #header>
      <div class="flex items-center gap-3">
        <div class="size-8 rounded-full bg-elevated flex items-center justify-center shrink-0">
          <UIcon
            :name="message?.type === 'contact' ? 'i-lucide-mail' : 'i-lucide-rss'"
            class="size-4"
            :class="message?.type === 'contact' ? 'text-primary' : 'text-success'"
          />
        </div>
        <div>
          <p class="text-sm font-semibold text-default">{{ message?.name ?? message?.email }}</p>
          <p v-if="message?.name" class="text-xs text-muted">{{ message.email }}</p>
        </div>
        <UBadge
          :label="message?.type === 'contact' ? 'Contact' : 'Newsletter'"
          :color="message?.type === 'contact' ? 'primary' : 'success'"
          variant="subtle"
          size="xs"
          class="ml-auto"
        />
      </div>
    </template>

    <template #body>
      <div class="flex flex-col gap-5 p-4">
        <div class="flex items-center gap-2 text-xs text-muted">
          <UIcon name="i-lucide-clock" class="size-3.5" />
          <span>{{ message ? formatDate(message.createdAt) : '' }}</span>
        </div>

        <div v-if="message?.message" class="rounded-xl bg-elevated/50 border border-default p-4">
          <p class="text-sm text-default whitespace-pre-wrap leading-relaxed">{{ message.message }}</p>
        </div>
        <div v-else class="rounded-xl bg-elevated/50 border border-default p-4 flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-rss" class="size-4 text-success" />
          Abonnement newsletter uniquement
        </div>

        <UButton
          v-if="brevoUrl"
          label="Voir dans Brevo"
          icon="i-lucide-external-link"
          variant="outline"
          color="neutral"
          size="sm"
          :to="brevoUrl"
          target="_blank"
        />
        <div v-else-if="loadingBrevo" class="flex items-center gap-2 text-xs text-muted">
          <UIcon name="i-lucide-loader-circle" class="size-3.5 animate-spin" />
          Recherche dans Brevo…
        </div>
      </div>
    </template>

    <template v-if="message?.type === 'contact'" #footer>
      <div class="p-4">
        <UButton
          label="Répondre par email"
          icon="i-lucide-reply"
          class="w-full"
          :to="`mailto:${message.email}?subject=Re: Contact depuis mon portfolio`"
          target="_blank"
        />
      </div>
    </template>
  </USlideover>
</template>