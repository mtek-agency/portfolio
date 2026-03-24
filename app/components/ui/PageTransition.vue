<script setup lang="ts">
const show = ref(false)
const entering = ref(false)
const router = useRouter()

router.beforeEach(() => {
  return new Promise<void>((resolve) => {
    show.value = true
    entering.value = true
    setTimeout(resolve, 420)
  })
})

router.afterEach(() => {
  nextTick(() => {
    entering.value = false
    setTimeout(() => { show.value = false }, 480)
  })
})
</script>

<template>
  <Teleport to="body">
    <div
      v-show="show"
      aria-hidden="true"
      class="fixed inset-0 z-[9998] bg-neutral-950 pointer-events-none will-change-transform"
      :style="{
        transform: entering ? 'scaleY(1)' : 'scaleY(0)',
        transformOrigin: entering ? 'bottom center' : 'top center',
        transition: `transform ${entering ? '0.42s' : '0.46s'} cubic-bezier(0.76, 0, 0.24, 1)`,
      }"
    />
  </Teleport>
</template>
