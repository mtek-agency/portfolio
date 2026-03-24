<script setup lang="ts">
import type { Project } from '~~/server/db/schema'

const props = defineProps<{ project: Project & { views: number } }>()

const toast = useAppToast()

const updatedAt = computed(() =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(props.project.updatedAt))
)

async function copyLink() {
  const url = `${window.location.origin}/projets/${props.project.slug}`
  await navigator.clipboard.writeText(url)
  toast.success('Lien copié !')
}
</script>

<template>
  <div class="flex items-center justify-between rounded-xl border border-default bg-elevated/40 px-5 py-3 gap-4 flex-wrap">
    <div class="flex items-center gap-4 flex-wrap text-sm text-muted">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-clock" class="size-4 shrink-0" />
        <span>Dernière modification : <span class="text-default font-medium">{{ updatedAt }}</span></span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-eye" class="size-4 shrink-0" />
        <span><span class="text-default font-medium">{{ project.views.toLocaleString('fr-FR') }}</span> vue{{ project.views !== 1 ? 's' : '' }}</span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <UButton
        label="Partager"
        icon="i-lucide-share-2"
        variant="ghost"
        color="neutral"
        size="sm"
        @click="copyLink"
      />
      <UButton
        label="Voir le projet"
        icon="i-lucide-external-link"
        variant="outline"
        color="neutral"
        size="sm"
        :to="`/projets/${project.slug}`"
        target="_blank"
      />
    </div>
  </div>
</template>
