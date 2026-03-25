<script setup lang="ts">
import { contactSchema } from '#shared/schemas/contact.schema'
import type { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

type ContactForm = z.infer<typeof contactSchema>

const token = ref('')
const sending = ref(false)
const success = ref(false)
const errorMsg = ref('')

const state = reactive<Omit<ContactForm, 'token'>>({
  name: '',
  email: '',
  message: '',
  newsletter: false,
})

async function onSubmit(e: FormSubmitEvent<ContactForm>) {
  sending.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { ...e.data, token: token.value },
    })
    success.value = true
  }
  catch {
    errorMsg.value = 'Une erreur est survenue. Réessayez ou écrivez-moi directement par email.'
  }
  finally {
    sending.value = false
  }
}
</script>

<template>
  <div>
    <!-- Success -->
    <div v-if="success" class="flex flex-col items-start gap-4">
      <div class="size-12 rounded-full bg-white/10 flex items-center justify-center mb-2">
        <UIcon name="i-lucide-check" class="size-5 text-white" />
      </div>
      <h3 class="font-display font-bold text-2xl text-white">Merci pour votre message !</h3>
      <p class="text-neutral-400">Je vous recontacte le plus rapidement possible.</p>
    </div>

    <!-- Form -->
    <UForm
      v-else
      :schema="contactSchema"
      :state="{ ...state, token }"
      class="flex flex-col gap-0"
      @submit="onSubmit"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
        <UFormField name="name" :ui="{ error: 'text-red-400 text-xs mt-1' }">
          <div class="border-b border-neutral-700 focus-within:border-white transition-[border-color] duration-300 pb-3 mb-8">
            <label class="block text-[10px] tracking-[0.35em] uppercase text-neutral-600 mb-3 font-medium">Nom</label>
            <input
              v-model="state.name"
              type="text"
              placeholder="Votre nom"
              class="w-full bg-transparent text-white text-base placeholder-neutral-700 outline-none"
            />
          </div>
        </UFormField>

        <UFormField name="email" :ui="{ error: 'text-red-400 text-xs mt-1' }">
          <div class="border-b border-neutral-700 focus-within:border-white transition-[border-color] duration-300 pb-3 mb-8">
            <label class="block text-[10px] tracking-[0.35em] uppercase text-neutral-600 mb-3 font-medium">Email</label>
            <input
              v-model="state.email"
              type="email"
              placeholder="Votre email"
              class="w-full bg-transparent text-white text-base placeholder-neutral-700 outline-none"
            />
          </div>
        </UFormField>
      </div>

      <UFormField name="message" :ui="{ error: 'text-red-400 text-xs mt-1' }">
        <div class="border-b border-neutral-700 focus-within:border-white transition-[border-color] duration-300 pb-3 mb-8">
          <label class="block text-[10px] tracking-[0.35em] uppercase text-neutral-600 mb-3 font-medium">Message</label>
          <textarea
            v-model="state.message"
            placeholder="Votre message"
            rows="4"
            class="w-full bg-transparent text-white text-base placeholder-neutral-700 outline-none resize-none leading-relaxed"
          />
        </div>
      </UFormField>

      <label class="flex items-start gap-4 cursor-pointer group mb-8">
        <div
          class="mt-0.5 size-4 rounded border flex-shrink-0 flex items-center justify-center transition-all duration-200"
          :class="state.newsletter
            ? 'bg-white border-white'
            : 'bg-transparent border-neutral-600 group-hover:border-neutral-400'"
          @click="state.newsletter = !state.newsletter"
        >
          <UIcon v-if="state.newsletter" name="i-lucide-check" class="size-2.5 text-black" />
        </div>
        <div @click="state.newsletter = !state.newsletter">
          <p class="text-sm text-neutral-300 font-medium">S'abonner à la newsletter</p>
          <p class="text-xs text-neutral-600 mt-0.5">Notifié lors de nouveaux articles et projets. Promis, pas de spam.</p>
        </div>
      </label>

      <ClientOnly>
        <NuxtTurnstile v-model="token" :options="{ size: 'invisible' }" />
      </ClientOnly>

      <p v-if="errorMsg" class="text-sm text-red-400 mb-4">{{ errorMsg }}</p>

      <button
        type="submit"
        :disabled="sending || !token"
        class="group self-start inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-sm tracking-wide hover:bg-neutral-200 transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ sending ? 'Envoi…' : 'Envoyer' }}
        <UIcon name="i-lucide-arrow-right" class="size-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </UForm>
  </div>
</template>
