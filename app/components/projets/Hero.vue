<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <section class="bg-neutral-950 min-h-[50vh] flex flex-col justify-end overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full pt-32">
      <div class="overflow-hidden mb-4">
        <p
          class="text-neutral-500 text-xs tracking-[0.3em] uppercase font-medium"
          style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s both"
        >
          {{ count }} projets
        </p>
      </div>
      <div class="overflow-hidden leading-[0.88]">
        <h1
          class="font-display font-black text-white tracking-tighter"
          style="font-size: clamp(3.5rem, 10vw, 10rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s both"
        >
          Projets.
        </h1>
      </div>
    </div>
  </section>
</template>
