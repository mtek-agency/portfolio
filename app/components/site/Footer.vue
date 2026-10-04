<script setup lang="ts">
const { token, failed, widget, options, email, sending, done, err, subscribe } = useNewsletter()
</script>

<template>
  <footer class="bg-neutral-950 border-t border-neutral-800/50">
    <div class="max-w-7xl mx-auto px-6 lg:px-12">

      <!-- Newsletter band -->
      <div class="py-10 md:py-14 border-b border-neutral-800/50">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-16">
          <!-- Headline -->
          <div class="shrink-0">
            <p class="text-[10px] tracking-[0.5em] uppercase text-neutral-600 font-medium mb-4 md:mb-6">Newsletter</p>
            <h2
              class="font-display font-black text-white tracking-tighter leading-[0.88]"
              style="font-size: clamp(2rem, 3.5vw, 4.5rem)"
            >
              Restez au<br>courant.
            </h2>
          </div>

          <!-- Form side -->
          <div class="w-full lg:max-w-lg">
            <p class="text-neutral-500 text-sm mb-5 leading-relaxed">
              Nouveaux articles et projets directement dans votre boîte mail. Pas de spam, promis.
            </p>

            <div v-if="done" class="flex items-center gap-4">
              <div class="size-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-check" class="size-4 text-white" />
              </div>
              <p class="text-neutral-300 font-medium">Merci ! Vous êtes bien inscrit·e.</p>
            </div>

            <div v-else>
              <div class="border-b-2 border-neutral-700 focus-within:border-white transition-[border-color] duration-300 flex items-center gap-3 pb-3 md:pb-4">
                <input
                  v-model="email"
                  type="email"
                  placeholder="votre@email.fr"
                  class="flex-1 min-w-0 bg-transparent text-white text-base md:text-xl placeholder-neutral-700 outline-none font-medium"
                  @keyup.enter="subscribe"
                />
                <button
                  :disabled="sending || !token || !email"
                  class="shrink-0 font-display font-black text-sm md:text-lg text-white hover:opacity-40 transition-opacity disabled:opacity-20 tracking-tight whitespace-nowrap"
                  @click="subscribe"
                >
                  {{ sending ? '…' : "S'abonner →" }}
                </button>
              </div>
              <ClientOnly>
                <NuxtTurnstile ref="widget" v-model="token" :options="options" />
              </ClientOnly>
              <p v-if="failed" class="text-xs text-red-400 mt-3">
        La vérification anti-spam n'a pas pu se charger : désactivez votre bloqueur de publicités ou rechargez la page.
      </p>
      <p v-else-if="err" class="text-xs text-red-400 mt-3">{{ err }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main footer -->
      <div class="py-10 flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-12">
        <!-- Brand -->
        <div class="max-w-xs">
          <div class="flex items-center gap-0.5 mb-4">
            <span class="font-display font-black text-2xl text-white tracking-tight">mb</span>
            <span class="font-display font-black text-2xl text-neutral-500">.</span>
          </div>
          <p class="text-neutral-500 text-sm leading-relaxed">
            Développeur web & mobile basé à Bordeaux. Je donne vie aux idées.
          </p>
        </div>

        <!-- Links -->
        <div class="flex gap-8 md:gap-16 lg:gap-24">
          <div>
            <p class="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-5 font-medium">Navigation</p>
            <div class="flex flex-col gap-3">
              <NuxtLink to="/" class="text-sm text-neutral-400 hover:text-white transition-colors duration-200">Accueil</NuxtLink>
              <NuxtLink to="/a-propos" class="text-sm text-neutral-400 hover:text-white transition-colors duration-200">À propos</NuxtLink>
              <NuxtLink to="/projets" class="text-sm text-neutral-400 hover:text-white transition-colors duration-200">Projets</NuxtLink>
              <NuxtLink to="/blog" class="text-sm text-neutral-400 hover:text-white transition-colors duration-200">Blog</NuxtLink>
            </div>
          </div>
          <div>
            <p class="text-xs tracking-[0.3em] uppercase text-neutral-600 mb-5 font-medium">Contact</p>
            <div class="flex flex-col gap-3">
              <a href="mailto:contact@matteo-bonneval.fr" class="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                contact@matteo-bonneval.fr
              </a>
              <a href="https://www.linkedin.com/in/matteo-bonneval" target="_blank" rel="noopener" class="text-sm text-neutral-400 hover:text-white transition-colors duration-200">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom bar -->
      <div class="py-5 border-t border-neutral-800/50 flex flex-col md:flex-row items-center justify-between gap-3">
        <p class="text-xs text-neutral-600">
          Mattéo Bonneval — Copyright © <ClientOnly>{{ new Date().getFullYear() }}<template #fallback>2026</template></ClientOnly>
        </p>
        <p class="text-xs text-neutral-600">
          Bordeaux, France
        </p>
      </div>
    </div>
  </footer>
</template>
