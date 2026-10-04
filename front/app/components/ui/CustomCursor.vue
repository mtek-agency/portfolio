<script setup lang="ts">
const x = ref(-200)
const y = ref(-200)
const isHovering = ref(false)
const cursorLabel = ref<string | null>(null)
const hasMouse = ref(false)

onMounted(() => {
  hasMouse.value = window.matchMedia('(pointer: fine)').matches
  if (!hasMouse.value) return

  const onMove = (e: MouseEvent) => {
    x.value = e.clientX
    y.value = e.clientY
  }
  const onOver = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const interactive = target.closest('a, button, [data-cursor]')
    isHovering.value = !!interactive
    const cursorEl = target.closest('[data-cursor]') as HTMLElement | null
    cursorLabel.value = cursorEl?.dataset.cursor ?? null
  }
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseover', onOver, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseover', onOver)
  })
})
</script>

<template>
  <ClientOnly>
    <template v-if="hasMouse">
      <!-- Dot — precise, immediate -->
      <div
        class="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        :style="{ transform: `translate(${x - 4}px, ${y - 4}px)` }"
      >
        <div class="size-2 rounded-full bg-white" />
      </div>

      <!-- Label cursor (e.g. "VOIR") -->
      <div
        v-if="cursorLabel"
        class="fixed top-0 left-0 pointer-events-none z-[9998] will-change-transform"
        :style="{ transform: `translate(${x - 36}px, ${y - 36}px)` }"
      >
        <div
          class="size-[72px] rounded-full bg-white flex items-center justify-center transition-transform duration-300"
          style="transform: scale(1)"
        >
          <span class="text-black text-[9px] tracking-[0.3em] uppercase font-semibold select-none">
            {{ cursorLabel }}
          </span>
        </div>
      </div>

      <!-- Standard ring — hidden when label is active -->
      <div
        v-else
        class="fixed top-0 left-0 pointer-events-none z-[9998] mix-blend-difference will-change-transform"
        :style="{ transform: `translate(${isHovering ? x - 22 : x - 14}px, ${isHovering ? y - 22 : y - 14}px)` }"
      >
        <div
          class="rounded-full border border-white transition-all duration-300 ease-out"
          :class="isHovering ? 'size-11' : 'size-7'"
        />
      </div>
    </template>
  </ClientOnly>
</template>
