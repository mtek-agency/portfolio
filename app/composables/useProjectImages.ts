import type { ProjectImage } from '~~/server/db/schema'

export function useProjectImages(slug: Ref<string>, refresh: () => void | Promise<void>) {
  const toast = useAppToast()
  const fileInput = ref<HTMLInputElement>()
  const uploadingImages = ref(false)
  const deletingImageId = ref<number | null>(null)

  async function uploadFiles(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files?.length) return

    uploadingImages.value = true
    try {
      const formData = new FormData()
      for (const file of files) formData.append('images', file)
      await $fetch(`/api/projects/${slug.value}/images`, { method: 'POST', body: formData })
      await refresh()
      toast.success(`${files.length} image${files.length > 1 ? 's' : ''} ajoutée${files.length > 1 ? 's' : ''}`)
    }
    catch {
      toast.error('Erreur upload', "Impossible d'uploader les images")
    }
    finally {
      uploadingImages.value = false
      if (fileInput.value) fileInput.value.value = ''
    }
  }

  async function deleteImage(image: ProjectImage) {
    deletingImageId.value = image.id
    try {
      await $fetch(`/api/images/${image.id}`, { method: 'DELETE' })
      await refresh()
    }
    catch {
      toast.error('Erreur', "Impossible de supprimer l'image")
    }
    finally {
      deletingImageId.value = null
    }
  }

  async function reorderImages(ids: number[]) {
    try {
      await $fetch(`/api/projects/${slug.value}/images`, {
        method: 'PATCH',
        body: { ids },
      })
    }
    catch {
      toast.error('Erreur', "Impossible de sauvegarder l'ordre")
    }
  }

  return { fileInput, uploadingImages, deletingImageId, uploadFiles, deleteImage, reorderImages }
}
