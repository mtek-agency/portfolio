<script setup lang="ts">
defineProps<{
  filename: string
  index: number
  total: number
}>()

const emit = defineEmits<{
  close: []
  prev: []
  next: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 cursor-zoom-out"
        @click="emit('close')"
      >
        <UTooltip v-if="index > 0" side="right">
          <UButton icon="i-lucide-chevron-left" variant="ghost" color="neutral" size="xl" class="absolute left-4 top-1/2 -translate-y-1/2 text-white! hover:text-white! hover:bg-white/10" @click.stop="emit('prev')" />
          <template #content><div class="flex items-center gap-1">Image précédente <UKbd>←</UKbd></div></template>
        </UTooltip>

        <img :src="`/api/images/${filename}`" :alt="filename" class="max-w-[90vw] max-h-[90vh] object-contain select-none rounded-lg shadow-2xl cursor-default" @click.stop>

        <UTooltip v-if="index < total - 1" side="left">
          <UButton icon="i-lucide-chevron-right" variant="ghost" color="neutral" size="xl" class="absolute right-4 top-1/2 -translate-y-1/2 text-white! hover:text-white! hover:bg-white/10" @click.stop="emit('next')" />
          <template #content><div class="flex items-center gap-1">Image suivante <UKbd>→</UKbd></div></template>
        </UTooltip>

        <UTooltip side="left">
          <UButton icon="i-lucide-x" variant="ghost" color="neutral" size="lg" class="absolute top-4 right-4 text-white! hover:text-white! hover:bg-white/10" @click.stop="emit('close')" />
          <template #content><div class="flex items-center gap-1">Fermer <UKbd>Esc</UKbd></div></template>
        </UTooltip>

        <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm tabular-nums">
          {{ index + 1 }} / {{ total }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>