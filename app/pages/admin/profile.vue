<script setup lang="ts">
import { profileUpdateSchema, passwordUpdateSchema } from '#shared/schemas/user.schema'
import type { ProfileUpdateInput, PasswordUpdateInput } from '#shared/schemas/user.schema'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
})

const { user, fetch: fetchSession } = useUserSession()
const toast = useToast()

// Profile form
const profileState = reactive<ProfileUpdateInput>({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
})
const savingProfile = ref(false)

async function onSaveProfile(event: FormSubmitEvent<ProfileUpdateInput>) {
  savingProfile.value = true
  try {
    await $fetch('/api/user/profile', { method: 'PUT', body: event.data })
    await fetchSession()
    profileState.name = user.value?.name ?? ''
    profileState.email = user.value?.email ?? ''
    toast.add({ title: 'Profil mis à jour', color: 'neutral', icon: 'i-lucide-check' })
  }
  catch {
    toast.add({ title: 'Erreur', description: 'Impossible de mettre à jour le profil', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    savingProfile.value = false
  }
}

// Password form
const passwordState = reactive<PasswordUpdateInput>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const savingPassword = ref(false)

async function onSavePassword(event: FormSubmitEvent<PasswordUpdateInput>) {
  savingPassword.value = true
  try {
    await $fetch('/api/user/password', { method: 'PUT', body: event.data })
    passwordState.currentPassword = ''
    passwordState.newPassword = ''
    passwordState.confirmPassword = ''
    toast.add({ title: 'Mot de passe mis à jour', color: 'neutral', icon: 'i-lucide-check' })
  }
  catch (e: any) {
    const msg = e?.data?.message || 'Impossible de changer le mot de passe'
    toast.add({ title: 'Erreur', description: msg, color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    savingPassword.value = false
  }
}

// Avatar upload
const avatarInput = ref<HTMLInputElement | null>(null)
const uploadingAvatar = ref(false)

function openAvatarPicker() {
  avatarInput.value?.click()
}

async function onAvatarChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('avatar', file)
    await $fetch('/api/user/avatar', { method: 'POST', body: formData })
    await fetchSession()
    toast.add({ title: 'Photo de profil mise à jour', color: 'neutral', icon: 'i-lucide-check' })
  }
  catch {
    toast.add({ title: 'Erreur', description: "Impossible d'uploader l'image", color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    uploadingAvatar.value = false
    if (avatarInput.value) avatarInput.value.value = ''
  }
}

const avatarSrc = computed(() => {
  const avatar = user.value?.avatar
  if (!avatar) return null
  if (avatar.startsWith('http')) return avatar
  return `/api/images/${avatar}`
})
</script>

<template>
  <DashboardPanel title="Mon profil">
    <div class="p-6 max-w-2xl flex flex-col gap-8">

      <!-- Avatar -->
      <div class="flex items-center gap-6">
        <div class="relative group">
          <UAvatar
            :src="avatarSrc ?? undefined"
            :alt="user?.name"
            size="3xl"
            class="ring-2 ring-default"
          />
          <button
            class="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            :class="{ 'opacity-100': uploadingAvatar }"
            @click="openAvatarPicker"
          >
            <UIcon v-if="!uploadingAvatar" name="i-lucide-camera" class="size-5 text-white" />
            <UIcon v-else name="i-lucide-loader" class="size-5 text-white animate-spin" />
          </button>
          <input
            ref="avatarInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onAvatarChange"
          >
        </div>
        <div>
          <p class="font-semibold text-default text-lg">{{ user?.name }}</p>
          <p class="text-sm text-muted">{{ user?.email }}</p>
          <UButton
            label="Changer la photo"
            variant="ghost"
            color="neutral"
            size="xs"
            icon="i-lucide-upload"
            class="mt-2 -ml-2"
            :loading="uploadingAvatar"
            @click="openAvatarPicker"
          />
        </div>
      </div>

      <USeparator />

      <!-- Profile info -->
      <div>
        <h2 class="text-sm font-semibold text-default mb-4">Informations</h2>
        <UForm
          id="profile-form"
          :schema="profileUpdateSchema"
          :state="profileState"
          class="flex flex-col gap-4"
          @submit="onSaveProfile"
        >
          <UFormField name="name" label="Nom">
            <UInput v-model="profileState.name" placeholder="Mon nom" class="w-full" />
          </UFormField>
          <UFormField name="email" label="Email">
            <UInput v-model="profileState.email" type="email" placeholder="moi@exemple.com" class="w-full" />
          </UFormField>
          <div class="flex justify-end">
            <UButton
              label="Enregistrer"
              icon="i-lucide-check"
              type="submit"
              form="profile-form"
              :loading="savingProfile"
            />
          </div>
        </UForm>
      </div>

      <USeparator />

      <!-- Password -->
      <div>
        <h2 class="text-sm font-semibold text-default mb-4">Changer le mot de passe</h2>
        <UForm
          id="password-form"
          :schema="passwordUpdateSchema"
          :state="passwordState"
          class="flex flex-col gap-4"
          @submit="onSavePassword"
        >
          <UFormField name="currentPassword" label="Mot de passe actuel">
            <UInput v-model="passwordState.currentPassword" type="password" class="w-full" />
          </UFormField>
          <UFormField name="newPassword" label="Nouveau mot de passe">
            <UInput v-model="passwordState.newPassword" type="password" class="w-full" />
          </UFormField>
          <UFormField name="confirmPassword" label="Confirmer le mot de passe">
            <UInput v-model="passwordState.confirmPassword" type="password" class="w-full" />
          </UFormField>
          <div class="flex justify-end">
            <UButton
              label="Mettre à jour"
              icon="i-lucide-lock"
              type="submit"
              form="password-form"
              :loading="savingPassword"
            />
          </div>
        </UForm>
      </div>

    </div>
  </DashboardPanel>
</template>