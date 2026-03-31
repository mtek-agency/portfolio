<script setup lang="ts">
const scrolled = ref(false)
const menuOpen = ref(false)
const colorMode = useColorMode()
const route = useRoute()

const isDark = computed(() => {
  if (colorMode.preference === 'dark') return true
  if (colorMode.preference === 'light') return false
  return isDark
})

watch(() => route.path, () => { menuOpen.value = false })

watch(menuOpen, (open) => {
  if (import.meta.client) document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  const onScroll = () => { scrolled.value = window.scrollY > 40 }
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') menuOpen.value = false }
  const onTouchMove = () => { if (menuOpen.value) menuOpen.value = false }
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchmove', onTouchMove, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('touchmove', onTouchMove)
    document.body.style.overflow = ''
  })
})

const links = [
  { label: 'À propos', to: '/a-propos' },
  { label: 'Projets', to: '/projets' },
  { label: 'Blog', to: '/blog' },
]

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-500"
    :class="scrolled
      ? 'bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200/80 dark:border-neutral-800/60'
      : ''"
  >
    <nav class="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="group flex items-center gap-0.5 relative z-10">
        <span
          class="font-display font-black text-xl transition-colors duration-300 tracking-tight"
          :class="[scrolled ? 'text-neutral-950 dark:text-white' : 'text-white', menuOpen ? '!text-white' : '']"
        >mb</span>
        <span
          class="font-display font-black text-xl transition-all duration-300 group-hover:translate-x-0.5"
          :class="[scrolled ? 'text-neutral-400 dark:text-neutral-500' : 'text-white/40', menuOpen ? '!text-neutral-600' : '']"
        >.</span>
      </NuxtLink>

      <!-- Right side -->
      <div class="flex items-center gap-5 md:gap-8">
        <!-- Desktop links -->
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

        <!-- Social links -->
        <div class="hidden md:flex items-center gap-4">
          <a
            v-for="social in [
              { href: 'https://www.linkedin.com/in/matteo-bonneval', icon: 'i-lucide-linkedin', label: 'LinkedIn' },
              { href: 'https://github.com/matteobnvl', icon: 'i-lucide-github', label: 'GitHub' },
              { href: 'https://gitlab.com/matteobnvl', icon: 'i-simple-icons-gitlab', label: 'GitLab' },
            ]"
            :key="social.label"
            :href="social.href"
            :aria-label="social.label"
            target="_blank"
            rel="noopener"
            class="p-1 transition-colors duration-300 relative z-10"
            :class="[
              scrolled ? 'text-neutral-400 hover:text-neutral-900 dark:text-neutral-600 dark:hover:text-white' : 'text-white/30 hover:text-white',
              menuOpen ? '!text-neutral-600 hover:!text-white' : ''
            ]"
          >
            <UIcon :name="social.icon" class="size-4" />
          </a>
        </div>

        <!-- Theme toggle -->
        <button
          class="transition-colors duration-300 p-1 relative z-10"
          :class="[
            scrolled ? 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white' : 'text-white/50 hover:text-white',
            menuOpen ? '!text-neutral-400 hover:!text-white' : ''
          ]"
          :aria-label="isDark ? 'Mode clair' : 'Mode sombre'"
          @click="toggleTheme"
        >
          <UIcon :name="isDark ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>

        <!-- Burger (mobile only) -->
        <button
          class="md:hidden relative z-10 w-7 h-5 flex flex-col justify-between focus:outline-none"
          :class="menuOpen ? 'text-white' : scrolled ? 'text-neutral-700 dark:text-neutral-300' : 'text-white'"
          :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="menuOpen = !menuOpen"
        >
          <span
            class="block w-full h-px bg-current transition-all duration-300 origin-center"
            :class="menuOpen ? 'rotate-45 translate-y-[9px]' : ''"
          />
          <span
            class="block h-px bg-current transition-all duration-300"
            :class="menuOpen ? 'opacity-0 -translate-x-3' : 'w-4'"
          />
          <span
            class="block w-full h-px bg-current transition-all duration-300 origin-center"
            :class="menuOpen ? '-rotate-45 -translate-y-[9px]' : ''"
          />
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile menu fullscreen overlay -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-40 bg-neutral-950 flex flex-col px-6 pt-20 pb-10 md:hidden"
      >
        <!-- Links -->
        <nav class="flex-1 flex flex-col justify-center gap-1">
          <NuxtLink
            v-for="(link, i) in links"
            :key="link.to"
            :to="link.to"
            class="group flex items-center justify-between py-6 border-b border-neutral-800/60"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="flex items-baseline gap-5">
              <span class="text-xs font-mono text-neutral-700">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="font-display font-black text-white tracking-tighter transition-transform duration-300 group-hover:translate-x-2"
                style="font-size: clamp(2.8rem, 12vw, 5rem)">
                {{ link.label }}
              </span>
            </div>
            <UIcon name="i-lucide-arrow-up-right" class="size-5 text-neutral-600 shrink-0 transition-all duration-300 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </NuxtLink>
        </nav>

        <!-- Bottom bar -->
        <div class="flex items-center justify-between pt-8 border-t border-neutral-800/60">
          <div class="flex items-center gap-5">
            <a
              href="https://www.linkedin.com/in/matteo-bonneval"
              target="_blank"
              rel="noopener"
              class="text-xs tracking-[0.2em] uppercase text-neutral-600 hover:text-white transition-colors"
            >LinkedIn</a>
            <a
              href="https://github.com/matteobnvl"
              target="_blank"
              rel="noopener"
              class="text-xs tracking-[0.2em] uppercase text-neutral-600 hover:text-white transition-colors"
            >GitHub</a>
          </div>
          <button
            class="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-neutral-600 hover:text-white transition-colors"
            @click="menuOpen = false"
          >
            Fermer
            <UIcon name="i-lucide-x" class="size-3.5" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mobile-menu-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease-in;
}
.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
