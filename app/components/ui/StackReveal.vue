<script setup lang="ts">
const lines = [
  ['Nuxt', 'TypeScript', 'TailwindCSS', 'React'],
  ['NestJS', 'Symfony', 'PostgreSQL', 'Supabase', 'PostgreSQL'],
  ['Expo', 'Docker', 'GitLab', 'GitHub', 'Figma'],
]

const sectionEl = ref<HTMLElement | null>(null)
const offsets = ref([0, 0, 0])

onMounted(() => {
  let raf = 0

  const update = () => {
    if (!sectionEl.value) return
    const rect = sectionEl.value.getBoundingClientRect()
    const vh = window.innerHeight
    // centerOffset: positive when section is below viewport center, negative when above
    const centerOffset = (rect.top + rect.height / 2) - vh / 2
    const factor = 0.18

    offsets.value = [
      centerOffset * factor,        // line 0 → right when below, left when above
      -(centerOffset * factor),     // line 1 → left when below, right when above
      centerOffset * factor,        // line 2 → same as line 0
    ]
  }

  const onScroll = () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(update)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  update()

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
  })
})
</script>

<template>
  <div ref="sectionEl" class="overflow-hidden bg-neutral-950 py-6 border-y border-neutral-800/60">
    <div
      v-for="(line, i) in lines"
      :key="i"
      class="overflow-hidden"
      :class="i > 0 ? 'mt-0.5' : ''"
    >
      <div
        class="flex whitespace-nowrap w-max will-change-transform"
        :style="{ transform: `translateX(${offsets[i]}px)` }"
      >
        <template v-for="n in 3" :key="n">
          <span
            v-for="tech in line"
            :key="`${n}-${tech}`"
            class="font-display font-black uppercase tracking-tighter select-none"
            :class="i % 2 === 0 ? 'text-white' : 'text-neutral-800'"
            style="font-size: clamp(2.8rem, 6vw, 7rem); line-height: 1.05"
          >
            {{ tech }}<span class="mx-3 md:mx-6 text-neutral-800">·</span>
          </span>
        </template>
      </div>
    </div>
  </div>
</template>
