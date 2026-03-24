<script setup lang="ts">
const { el, isVisible } = useReveal({ threshold: 0.15 })

const lines = ['Je transforme', 'vos idées en', 'solutions', 'numériques.']
</script>

<template>
  <section ref="el" class="bg-neutral-100 dark:bg-neutral-950 py-36 lg:py-56 overflow-hidden">
    <div class="max-w-screen-xl mx-auto px-6 lg:px-12">
      <div v-for="(line, i) in lines" :key="line" class="overflow-hidden">
        <p
          class="font-display font-black text-neutral-950 dark:text-white tracking-tighter leading-[0.92] transition-all duration-1000 ease-out"
          style="font-size: clamp(2.5rem, 7.5vw, 8.5rem)"
          :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'"
          :style="{ transitionDelay: `${i * 110}ms` }"
        >
          {{ line }}
        </p>
      </div>
    </div>
  </section>
</template>
