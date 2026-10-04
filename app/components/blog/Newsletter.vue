<script setup lang="ts">
const { token, failed, widget, options, email, sending, done, err, subscribe } = useNewsletter()
</script>

<template>
  <div class="bg-neutral-950 rounded-2xl lg:rounded-3xl px-8 py-10 lg:px-12 lg:py-14">
    <div v-if="done" class="flex items-center gap-4">
      <div class="size-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <UIcon name="i-lucide-check" class="size-4 text-white" />
      </div>
      <div>
        <p class="text-white font-semibold">Merci !</p>
        <p class="text-neutral-400 text-sm">Vous recevrez les prochains articles par email.</p>
      </div>
    </div>

    <div v-else>
      <p class="text-[10px] tracking-[0.4em] uppercase text-neutral-500 font-medium mb-5">Newsletter</p>
      <h3 class="font-display font-black text-white tracking-tighter leading-tight mb-2" style="font-size: clamp(1.6rem, 3vw, 2.8rem)">
        Cet article vous a plu ?
      </h3>
      <p class="text-neutral-400 text-base mb-8 leading-relaxed">
        Recevez les prochains directement dans votre boîte mail. Pas de spam.
      </p>

      <div class="border-b-2 border-neutral-700 focus-within:border-white transition-[border-color] duration-300 flex items-center gap-4 pb-4">
        <input
          v-model="email"
          type="email"
          placeholder="votre@email.fr"
          class="flex-1 min-w-0 bg-transparent text-white text-base placeholder-neutral-700 outline-none font-medium"
          @keyup.enter="subscribe"
        />
        <button
          :disabled="sending || !token || !email"
          class="shrink-0 font-display font-black text-base text-white hover:opacity-40 transition-opacity disabled:opacity-20 tracking-tight whitespace-nowrap"
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
</template>
