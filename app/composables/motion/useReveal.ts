export function useReveal(options?: IntersectionObserverInit) {
  const el = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          observer?.disconnect()
        }
      },
      { threshold: 0.1, ...options },
    )
    if (el.value) observer.observe(el.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { el, isVisible }
}
