<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'blank'
})

const toast = useAppToast()
const route = useRoute()
const { fetch: fetchSession } = useUserSession()

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: 'Email',
  placeholder: 'Enter your email',
  required: true
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password',
  required: true
}]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const loading = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    const { error } = await useFetch('/api/auth/login', {
      method: 'POST',
      body: payload.data
    })

    if (error.value) {
      toast.error('Login failed', error.value.message || 'Invalid credentials')
      return
    }

    await fetchSession()

    toast.success('Login success', 'You have been successfully logged in')

    const redirectTo = (route.query.redirect as string) || '/admin'
    await navigateTo(redirectTo)

  } catch {
    toast.error('Error', 'An error occurred during login')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center gap-4 p-4">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
          :schema="schema"
          title="Connexion"
          description="Entrez vos identifiants pour vous connecter."
          icon="i-lucide-user"
          :fields="fields"
          :loading="loading"
          @submit="onSubmit"
      />
    </UPageCard>
  </div>
</template>