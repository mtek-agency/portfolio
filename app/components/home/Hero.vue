<script setup lang="ts">
</script>
<template>
  <section class="relative min-h-svh bg-neutral-950 flex flex-col overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-white/[0.025] rounded-full blur-[140px]" />
    </div>

    <div class="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 lg:px-12 pb-20 pt-32">
      <div class="overflow-hidden mb-8">
        <p
          class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
          style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both"
        >
          MATTÉO BONNEVAL · BORDEAUX, FRANCE
        </p>
      </div>

      <div>
        <div v-for="(line, i) in ['JE DONNE VIE', 'AUX IDÉES.']" :key="line" class="overflow-hidden leading-[0.88]">
          <h1
            class="font-display font-black text-white tracking-tighter block"
            :style="`font-size: clamp(2.2rem, 5.5vw, 6.5rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s both`"
          >
            {{ line }}
          </h1>
        </div>
      </div>

      <div
        class="mt-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
        style="animation: line-up 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s both"
      >
        <NuxtLink to="/projets" class="group inline-flex items-center gap-4 text-white">
          <span class="text-xs tracking-[0.25em] uppercase font-medium">Voir mes projets</span>
          <div class="size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-colors duration-300 group-hover:text-black" />
          </div>
        </NuxtLink>
      </div>
    </div>

    <div
      class="absolute bottom-8 right-12 flex flex-col items-center gap-3"
      style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.9s both"
    >
      <span class="text-[9px] tracking-[0.35em] uppercase text-neutral-600 [writing-mode:vertical-lr]">SCROLL</span>
      <div class="w-px h-14 bg-gradient-to-b from-neutral-600 to-transparent" />
    </div>
  </section>
</template>
