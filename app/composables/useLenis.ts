import type Lenis from 'lenis'

export const useLenis = () => {
  const nuxtApp = useNuxtApp()
  const provider = nuxtApp.$lenis as { get: () => Lenis | null }
  return provider?.get() ?? null
}
