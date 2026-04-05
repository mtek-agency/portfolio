<script setup lang="ts">
const show = ref(false)
const entering = ref(false)
const textVisible = ref(false)
const router = useRouter()

router.beforeEach(() => {
  return new Promise<void>((resolve) => {
    show.value = true
    entering.value = true
    textVisible.value = false
    // Show branding when curtain is ~85% covered
    setTimeout(() => { textVisible.value = true }, 280)
    setTimeout(resolve, 460)
  })
})

router.afterEach(() => {
  nextTick(() => {
    textVisible.value = false
    entering.value = false
    setTimeout(() => { show.value = false }, 560)
  })
})
</script>

<template>
  <Teleport to="body">
    <!-- Curtain — scaleY, no text inside to avoid distortion -->
    <div
      v-show="show"
      aria-hidden="true"
      class="fixed inset-0 z-[9998] bg-neutral-950 pointer-events-none will-change-transform"
      :style="{
        transform: entering ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: entering ? 'bottom center' : 'top center',
        transition: `transform ${entering ? '0.46s' : '0.56s'} cubic-bezier(0.76, 0, 0.24, 1)`,
      }"
    />
    <!-- Branding — separate element, no scale distortion -->
    <div
      aria-hidden="true"
      class="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center transition-opacity duration-200"
      :class="textVisible ? 'opacity-100' : 'opacity-0'"
    >
      <span class="font-display font-black text-white select-none" style="font-size: 1.35rem; letter-spacing: -0.04em">
        mb<span class="text-neutral-600">.</span>
      </span>
    </div>
  </Teleport>
</template>
