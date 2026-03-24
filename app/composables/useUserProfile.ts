import { profileUpdateSchema, passwordUpdateSchema } from '#shared/schemas/user.schema'
import type { ProfileUpdateInput, PasswordUpdateInput } from '#shared/schemas/user.schema'

export { profileUpdateSchema, passwordUpdateSchema }
export type { ProfileUpdateInput, PasswordUpdateInput }

export function useUserProfile() {
  const { user, fetch: fetchSession } = useUserSession()
  const toast = useAppToast()

  const avatarSrc = computed(() => {
    const avatar = user.value?.avatar
    if (!avatar) return null
    if (avatar.startsWith('http')) return avatar
    return `/api/images/${avatar}`
  })

  // Profile
  const savingProfile = ref(false)

  async function saveProfile(data: ProfileUpdateInput) {
    savingProfile.value = true
    try {
      await $fetch('/api/user/profile', { method: 'PUT', body: data })
      await fetchSession()
      toast.success('Profil mis à jour')
    }
    catch {
      toast.error('Erreur', 'Impossible de mettre à jour le profil')
    }
    finally {
      savingProfile.value = false
    }
  }

  // Password
  const savingPassword = ref(false)

  async function savePassword(data: PasswordUpdateInput) {
    savingPassword.value = true
    try {
      await $fetch('/api/user/password', { method: 'PUT', body: data })
      toast.success('Mot de passe mis à jour')
    }
    catch (e: any) {
      toast.error('Erreur', e?.data?.message || 'Impossible de changer le mot de passe')
    }
    finally {
      savingPassword.value = false
    }
  }

  // Avatar
  const uploadingAvatar = ref(false)

  async function uploadAvatar(file: File) {
    uploadingAvatar.value = true
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      await $fetch('/api/user/avatar', { method: 'POST', body: formData })
      await fetchSession()
      toast.success('Photo de profil mise à jour')
    }
    catch {
      toast.error('Erreur', "Impossible d'uploader l'image")
    }
    finally {
      uploadingAvatar.value = false
    }
  }

  return {
    user,
    avatarSrc,
    savingProfile,
    saveProfile,
    savingPassword,
    savePassword,
    uploadingAvatar,
    uploadAvatar,
  }
}
