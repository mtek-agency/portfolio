import type { Post } from '#shared/types/studio'

export function usePostHover() {
  const hoveredPost = ref<Post | null>(null)
  const mouseX = ref(0)
  const mouseY = ref(0)

  const hoveredImage = computed(() =>
    hoveredPost.value?.coverImage ? coverImageSrc(hoveredPost.value.coverImage) : null,
  )

  function onHover(e: MouseEvent, post: Post) {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
    hoveredPost.value = post
  }

  function onLeave() { hoveredPost.value = null }

  function onMouseMove(e: MouseEvent) {
    if (!hoveredPost.value) return
    mouseX.value = e.clientX
    mouseY.value = e.clientY
  }

  return { hoveredImage, mouseX, mouseY, onHover, onLeave, onMouseMove }
}
