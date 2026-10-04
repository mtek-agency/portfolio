<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage: string; message: string }
}>()

const handleError = () => clearError({ redirect: '/' })
const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: () => (is404.value ? 'Page introuvable' : 'Erreur'),
  robots: 'noindex',
})
</script>

<template>
  <div class="hide-cursor bg-neutral-950 min-h-screen flex flex-col overflow-hidden relative">
    <UiGrainOverlay />
    <UiCustomCursor />

    <!-- Background number — static, no animation, opacity kept intact -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
      <span
        class="font-display font-black text-white tracking-tighter leading-none"
        style="font-size: clamp(8rem, 28vw, 20rem); opacity: 0.05"
      >
        {{ error.statusCode }}
      </span>
    </div>

    <!-- Nav minimal -->
    <header class="relative z-10 shrink-0">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center">
        <NuxtLink to="/" class="font-display font-black text-xl text-white tracking-tight" @click="handleError">
          mb<span class="text-neutral-600">.</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Content -->
    <div class="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
      <div class="overflow-hidden mb-3">
        <p
          class="text-neutral-500 text-[10px] tracking-[0.5em] uppercase font-medium"
          style="animation: line-up 0.6s cubic-bezier(0.16,1,0.3,1) 0.1s both"
        >
          Erreur {{ error.statusCode }}
        </p>
      </div>

      <div class="overflow-hidden mb-6">
        <h1
          class="font-display font-black text-white tracking-tighter"
          style="font-size: clamp(2rem, 6vw, 5rem); animation: line-up 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both"
        >
          {{ is404 ? 'Page introuvable.' : 'Une erreur est survenue.' }}
        </h1>
      </div>

      <p
        class="text-neutral-500 mb-10 max-w-xs mx-auto text-sm leading-relaxed"
        style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both"
      >
        {{ is404
          ? 'Cette page n\'existe pas ou a été déplacée.'
          : 'Quelque chose s\'est mal passé. Réessayez ou revenez à l\'accueil.' }}
      </p>

      <div style="animation: line-up 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both">
        <button
          class="group inline-flex items-center gap-3 px-7 py-3.5 bg-white text-black rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors duration-300"
          @click="handleError"
        >
          Retour à l'accueil
          <UIcon name="i-lucide-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>
