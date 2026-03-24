import type { PublicProject } from '~/types/home'

export function useProjectHover() {
  const hoveredProject = ref<PublicProject | null>(null)
  const mouseX = ref(0)
  const mouseY = ref(0)

  const hoveredImage = computed(() => {
    const img = hoveredProject.value?.images[0]
    if (!img) return null
    return coverImageSrc(img.url)
  })

  function onHover(e: MouseEvent, project: PublicProject) {
    mouseX.value = e.clientX
    mouseY.value = e.clientY
    hoveredProject.value = project
  }

  function onLeave() {
    hoveredProject.value = null
  }

  function onMouseMove(e: MouseEvent) {
    if (!hoveredProject.value) return
    mouseX.value = e.clientX
    mouseY.value = e.clientY
  }

  return { hoveredProject, mouseX, mouseY, hoveredImage, onHover, onLeave, onMouseMove }
}
