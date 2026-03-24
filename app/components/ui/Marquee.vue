<script setup lang="ts">
const words = ['Nuxt', 'Vue', 'TypeScript', 'TailwindCSS', 'NestJS', 'Symfony', 'React', 'Expo', 'PostgreSQL', 'Docker', 'Supabase']
</script>

<template>
  <div class="overflow-hidden bg-neutral-950 border-y border-neutral-800/60 py-3.5 select-none">
    <div class="marquee-track flex items-center whitespace-nowrap w-max">
      <template v-for="n in 4" :key="n">
        <template v-for="(word, i) in words" :key="`${n}-${i}`">
          <span class="text-[10px] tracking-[0.4em] uppercase text-neutral-600 font-medium px-6">{{ word }}</span>
          <span class="text-neutral-800 text-sm">·</span>
        </template>
      </template>
    </div>
  </div>
</template>
