<script setup lang="ts">
const { complete } = usePreloader()

const count = ref(0)
const isLeaving = ref(false)
const isVisible = ref(true)

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

onMounted(() => {
  const COUNTER_DURATION = 1400
  const PAUSE = 120
  const EXIT_DURATION = 650
  const start = performance.now()

  const tick = (now: number) => {
    const elapsed = now - start
    const progress = Math.min(elapsed / COUNTER_DURATION, 1)
    count.value = Math.round(easeOutExpo(progress) * 100)

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      count.value = 100
      setTimeout(() => {
        isLeaving.value = true
        setTimeout(() => {
          isVisible.value = false
          complete()
        }, EXIT_DURATION)
      }, PAUSE)
    }
  }

  requestAnimationFrame(tick)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      aria-hidden="true"
      class="fixed inset-0 z-[99999] bg-neutral-950 flex flex-col px-6 lg:px-12"
      :style="{
        transform: isLeaving ? 'translateY(-100%)' : 'translateY(0)',
        transition: isLeaving ? 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
      }"
    >
      <!-- Counter -->
      <div class="flex-1 flex items-center justify-center">
        <span
          class="font-display font-black text-white select-none tabular-nums"
          style="font-size: clamp(5rem, 16vw, 13rem); line-height: 1; letter-spacing: -0.04em"
        >
          {{ String(count).padStart(2, '0') }}
        </span>
      </div>

      <!-- Bottom -->
      <div class="pb-10 flex flex-col gap-5">
        <div class="h-px bg-neutral-800 overflow-hidden">
          <div
            class="h-full bg-neutral-400"
            :style="{ width: `${count}%` }"
          />
        </div>
        <div class="flex items-center justify-between">
          <p class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium">
            MATTÉO BONNEVAL
          </p>
          <p class="text-neutral-700 text-[10px] tracking-[0.5em] uppercase font-medium">
            PORTFOLIO · 2025
          </p>
        </div>
      </div>
    </div>
  </Teleport>
</template>
