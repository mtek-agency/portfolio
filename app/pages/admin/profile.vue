<script setup lang="ts">
import type { ProfileUpdateInput, PasswordUpdateInput } from '#shared/schemas/user.schema'

definePageMeta({
  layout: 'admin',
  middleware: ['auth'],
  pageTransition: false,
})

useHead({ title: 'Profil' })

const {
  user,
  avatarSrc,
  savingProfile,
  saveProfile,
  savingPassword,
  savePassword,
  uploadingAvatar,
  uploadAvatar,
} = useUserProfile()
</script>

<template>
  <DashboardPanel title="Mon profil">
    <div class="p-6 max-w-2xl flex flex-col gap-8">
      <ProfileAvatarUpload
        :src="avatarSrc"
        :name="user?.name"
        :email="user?.email"
        :uploading="uploadingAvatar"
        @upload="uploadAvatar"
      />

      <USeparator />

      <ProfileInfoForm
        :name="user?.name ?? ''"
        :email="user?.email ?? ''"
        :saving="savingProfile"
        @submit="(data: ProfileUpdateInput) => saveProfile(data)"
      />

      <USeparator />

      <ProfilePasswordForm
        :saving="savingPassword"
        @submit="(data: PasswordUpdateInput) => savePassword(data)"
      />
    </div>
  </DashboardPanel>
</template>
