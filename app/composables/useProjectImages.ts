import type { ProjectImage } from '~~/server/db/schema'

export function useProjectImages(slug: Ref<string>, refresh: () => void | Promise<void>) {
  const toast = useToast()
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
      toast.add({
        title: `${files.length} image${files.length > 1 ? 's' : ''} ajoutée${files.length > 1 ? 's' : ''}`,
        color: 'success',
        icon: 'i-lucide-check',
      })
    }
    catch {
      toast.add({ title: 'Erreur upload', description: "Impossible d'uploader les images", color: 'error', icon: 'i-lucide-x' })
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
      toast.add({ title: 'Erreur', description: "Impossible de supprimer l'image", color: 'error', icon: 'i-lucide-x' })
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
      toast.add({ title: 'Erreur', description: "Impossible de sauvegarder l'ordre", color: 'error', icon: 'i-lucide-x' })
    }
  }

  return { fileInput, uploadingImages, deletingImageId, uploadFiles, deleteImage, reorderImages }
}
