<script setup lang="ts">
const scrolled = ref(false)
const colorMode = useColorMode()

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 40 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

const links = [
  { label: 'Projets', to: '/projets' },
  { label: 'Blog', to: '/blog' },
]

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    :class="scrolled
      ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/60'
      : ''"
  >
    <nav class="max-w-screen-xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="group flex items-center gap-0.5">
        <span
          class="font-display font-black text-xl transition-colors duration-300 tracking-tight"
          :class="scrolled ? 'text-neutral-950 dark:text-white' : 'text-white'"
        >mb</span>
        <span
          class="font-display font-black text-xl transition-all duration-300 group-hover:translate-x-0.5"
          :class="scrolled ? 'text-neutral-400 dark:text-neutral-500' : 'text-white/40'"
        >.</span>
      </NuxtLink>

      <!-- Right side -->
      <div class="flex items-center gap-8">
        <div class="hidden md:flex items-center gap-8">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            class="text-xs tracking-[0.25em] uppercase font-medium transition-colors duration-300"
            :class="scrolled
              ? 'text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
              : 'text-white/50 hover:text-white'"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <button
          class="transition-colors duration-300 p-1"
          :class="scrolled ? 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white' : 'text-white/50 hover:text-white'"
          :aria-label="colorMode.value === 'dark' ? 'Mode clair' : 'Mode sombre'"
          @click="toggleTheme"
        >
          <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>
      </div>
    </nav>
  </header>
</template>
