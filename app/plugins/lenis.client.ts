import Lenis from 'lenis'

// Routes where Lenis should be disabled (native scroll / scroll-snap)
const EXCLUDED_ROUTES = ['/blog']

export default defineNuxtPlugin((nuxtApp) => {
  let lenis: Lenis | null = null
  let rafId: number

  function createLenis() {
    lenis = new Lenis({
      duration: 0.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    function raf(time: number) {
      lenis!.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)
  }

  function destroyLenis() {
    cancelAnimationFrame(rafId)
    lenis?.destroy()
    lenis = null
  }

  createLenis()

  const router = useRouter()

  router.beforeEach((to) => {
    if (EXCLUDED_ROUTES.includes(to.path) && lenis) {
      destroyLenis()
    }
  })

  router.afterEach((to, from) => {
    const isExcluded = EXCLUDED_ROUTES.includes(to.path)
    const wasExcluded = EXCLUDED_ROUTES.includes(from.path)

    if (!isExcluded && (wasExcluded || !lenis)) {
      createLenis()
    } else if (!isExcluded && lenis) {
      lenis.scrollTo(0, { immediate: true })
    }
  })

  nuxtApp.provide('lenis', { get: () => lenis })
})
