<script setup lang="ts">
const glowX = ref(0)
const glowY = ref(0)

onMounted(() => {
  if (!window.matchMedia('(pointer: fine)').matches) return
  window.addEventListener('mousemove', onMouseMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
})

function onMouseMove(e: MouseEvent) {
  glowX.value = (e.clientX / window.innerWidth - 0.5) * 2
  glowY.value = (e.clientY / window.innerHeight - 0.5) * 2
}

const glowStyle = computed(() => ({
  transform: `translate(calc(-50% + ${glowX.value * 120}px), ${glowY.value * 70}px)`,
  transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
}))

function animStyle(delay: number, duration = '0.9s') {
  return { animation: `line-up ${duration} cubic-bezier(0.16,1,0.3,1) ${delay}s both` }
}
</script>

<template>
  <section class="relative min-h-svh bg-neutral-950 flex flex-col overflow-hidden">
    <div class="absolute inset-0 pointer-events-none">
      <div
        class="absolute top-0 left-1/2 w-[80vw] h-[60vh] bg-white/[0.025] rounded-full blur-[140px]"
        :style="glowStyle"
      />
    </div>

    <div class="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 lg:px-12 pb-20 pt-32">
      <div class="overflow-hidden mb-8">
        <p
          class="text-neutral-500 text-xs tracking-[0.3em] uppercase font-medium"
          :style="animStyle(0.1, '0.7s')"
        >
          MATTÉO BONNEVAL · BORDEAUX, FRANCE
        </p>
      </div>

      <h1
        class="font-display font-black text-white tracking-tighter"
        style="font-size: clamp(2rem, 5.5vw, 6.5rem)"
      >
        <span v-for="(line, i) in ['JE DONNE VIE', 'AUX IDÉES.']" :key="line" class="block overflow-hidden leading-[0.88]">
          <span class="block" :style="animStyle(0.25 + i * 0.15)">{{ line }}</span>
        </span>
      </h1>

      <p
        class="text-neutral-400 text-sm md:text-base mt-6"
        :style="animStyle(0.55, '0.8s')"
      >
        Développeur web & mobile fullstack — disponible pour de nouveaux projets
      </p>

      <div
        class="mt-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
        :style="animStyle(0.7, '0.8s')"
      >
        <UiMagnetic>
          <NuxtLink to="/projets" class="group inline-flex items-center gap-4 text-white">
            <span class="text-xs tracking-[0.25em] uppercase font-medium">Voir mes projets</span>
            <div class="size-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
              <UIcon name="i-lucide-arrow-right" class="size-4 transition-colors duration-300 group-hover:text-black" />
            </div>
          </NuxtLink>
        </UiMagnetic>
      </div>
    </div>

    <div
      class="absolute bottom-8 right-12 flex flex-col items-center gap-3"
      :style="animStyle(0.8, '0.7s')"
    >
      <span class="text-[9px] tracking-[0.35em] uppercase text-neutral-600 [writing-mode:vertical-lr]">SCROLL</span>
      <div class="w-px h-14 bg-gradient-to-b from-neutral-600 to-transparent" />
    </div>
  </section>
</template>
