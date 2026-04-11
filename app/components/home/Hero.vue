<script setup lang="ts">
const { isDone } = usePreloader()

// Scramble for each title line
const { output: title1, start: startTitle1 } = useScramble('JE DONNE VIE', { duration: 750 })
const { output: title2, start: startTitle2 } = useScramble('AUX IDÉES.', { duration: 700, delay: 120 })

watch(isDone, (done) => {
  if (done) {
    startTitle1()
    startTitle2()
  }
}, { immediate: true })

// Mouse parallax for the ambient glow
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

// Line-up animation for secondary elements
function animStyle(delay: number, duration = '0.9s') {
  return {
    animation: `line-up ${duration} cubic-bezier(0.16,1,0.3,1) ${delay}s both`,
    animationPlayState: isDone.value ? 'running' : 'paused',
  }
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
          class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
          :style="animStyle(0.1, '0.7s')"
        >
          MATTÉO BONNEVAL · BORDEAUX, FRANCE
        </p>
      </div>

      <h1 class="font-display font-black text-white tracking-tighter" :style="{ fontSize: 'clamp(2.2rem, 5.5vw, 6.5rem)' }">
        <span
          class="block leading-[0.88] transition-opacity duration-75"
          :class="isDone ? 'opacity-100' : 'opacity-0'"
        >{{ title1 }}</span>
        <span
          class="block leading-[0.88] transition-opacity duration-75"
          :class="isDone ? 'opacity-100' : 'opacity-0'"
          style="transition-delay: 40ms"
        >{{ title2 }}</span>
      </h1>

      <div
        class="mt-14 flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
        :style="animStyle(0.55, '0.8s')"
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
      :style="animStyle(0.75, '0.7s')"
    >
      <span class="text-[9px] tracking-[0.35em] uppercase text-neutral-600 [writing-mode:vertical-lr]">SCROLL</span>
      <div class="w-px h-14 bg-gradient-to-b from-neutral-600 to-transparent" />
    </div>
  </section>
</template>
