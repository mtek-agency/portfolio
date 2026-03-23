import type { ProjectImage } from '~~/server/db/schema'

export function useLightbox(images: Ref<ProjectImage[]>) {
  const zoomedImage = ref<ProjectImage | null>(null)

  const zoomedIndex = computed(() =>
    zoomedImage.value
      ? images.value.findIndex(img => img.id === zoomedImage.value!.id)
      : -1,
  )

  function open(image: ProjectImage) { zoomedImage.value = image }
  function close() { zoomedImage.value = null }

  function prev() {
    if (zoomedIndex.value <= 0) return
    zoomedImage.value = images.value[zoomedIndex.value - 1]!
  }

  function next() {
    if (zoomedIndex.value >= images.value.length - 1) return
    zoomedImage.value = images.value[zoomedIndex.value + 1]!
  }

  useKeyboardShortcut('Escape', close, { prevent: false })
  useKeyboardShortcut('ArrowLeft', () => { if (zoomedImage.value) prev() }, { prevent: false })
  useKeyboardShortcut('ArrowRight', () => { if (zoomedImage.value) next() })

  return { zoomedImage, zoomedIndex, open, close, prev, next }
}