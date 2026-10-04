<script setup lang="ts">
const props = withDefaults(defineProps<{ strength?: number }>(), { strength: 0.35 })

const el = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)
const hasMouse = ref(false)

onMounted(() => {
  hasMouse.value = window.matchMedia('(pointer: fine)').matches
})

function onMouseMove(e: MouseEvent) {
  if (!hasMouse.value || !el.value) return
  const rect = el.value.getBoundingClientRect()
  x.value = (e.clientX - (rect.left + rect.width / 2)) * props.strength
  y.value = (e.clientY - (rect.top + rect.height / 2)) * props.strength
}

function onMouseLeave() {
  x.value = 0
  y.value = 0
}

const style = computed(() => ({
  transform: `translate(${x.value}px, ${y.value}px)`,
  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
}))
</script>

<template>
  <div ref="el" :style="style" class="inline-block" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
    <slot />
  </div>
</template>
