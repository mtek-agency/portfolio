<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
  label?: string
}>(), {
  title: 'Mattéo Bonneval',
  description: 'Développeur Web & Mobile · Bordeaux',
  label: '',
})
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between" style="background: #0a0a0a; padding: 72px 80px; font-family: Inter, sans-serif;">
    <!-- Top: label -->
    <div class="flex items-center">
      <span style="color: #525252; font-size: 13px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;">
        {{ label || 'matteo-bonneval.fr' }}
      </span>
    </div>

    <!-- Middle: title + description -->
    <div class="flex flex-col" style="gap: 24px; max-width: 900px;">
      <h1 style="color: #ffffff; font-size: 72px; font-weight: 900; line-height: 0.9; letter-spacing: -0.04em; margin: 0;">
        {{ title }}
      </h1>
      <p v-if="description" style="color: #737373; font-size: 24px; line-height: 1.5; margin: 0;">
        {{ description }}
      </p>
    </div>

    <!-- Bottom: brand + location -->
    <div class="flex items-center justify-between">
      <div class="flex items-center" style="gap: 4px;">
        <span style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.04em;">mb</span>
        <span style="color: #525252; font-size: 24px; font-weight: 900;">.</span>
      </div>
      <div class="flex items-center" style="gap: 8px;">
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #404040;" />
        <span style="color: #404040; font-size: 13px; letter-spacing: 0.15em; text-transform: uppercase;">Bordeaux, France</span>
      </div>
    </div>
  </div>
</template>
