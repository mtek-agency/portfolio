<script setup lang="ts">
const { el, isVisible } = useReveal({ threshold: 0.2 })
</script>

<template>
  <section class="bg-neutral-50 dark:bg-neutral-950 py-16 lg:py-24 border-b border-neutral-100 dark:border-neutral-800/60">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div
        ref="el"
        class="flex flex-col md:flex-row md:items-end justify-between gap-12 transition-all duration-700"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
      >
        <div class="max-w-xl">
          <p
            class="font-display font-black text-neutral-950 dark:text-white tracking-tight leading-none mb-3"
            style="font-size: clamp(2rem, 4vw, 3.5rem)"
          >
            Wix existe.
          </p>
          <p class="text-neutral-500 dark:text-neutral-400 leading-relaxed text-base md:text-lg">
            J'aurais pu utiliser un template, perdre moins de temps, avoir des priorités saines. Tout ça pour un site vu essentiellement par ma mère.
          </p>
        </div>

        <UiMagnetic>
          <NuxtLink to="/a-propos" class="group inline-flex items-center gap-4 shrink-0 text-neutral-950 dark:text-white">
            <span class="text-xs tracking-[0.25em] uppercase font-medium">
              Découvrir le coupable
            </span>
            <div class="size-12 rounded-full border flex items-center justify-center transition-all duration-300 bg-neutral-950 border-neutral-950 dark:bg-white dark:border-white">
              <UIcon name="i-lucide-arrow-right" class="size-4 text-white dark:text-black transition-transform duration-300 group-hover:-rotate-45" />
            </div>
          </NuxtLink>
        </UiMagnetic>
      </div>
    </div>
  </section>
</template>
