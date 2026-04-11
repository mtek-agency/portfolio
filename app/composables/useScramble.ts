const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function useScramble(text: string, options?: { duration?: number; delay?: number }) {
  const { duration = 750, delay = 0 } = options ?? {}
  const output = ref(text)
  let rafId: number | null = null
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function start() {
    if (rafId) cancelAnimationFrame(rafId)
    if (timeoutId) clearTimeout(timeoutId)

    const chars = text.split('')
    const totalFrames = Math.round(duration / 16.67)
    let frame = 0

    function tick() {
      frame++
      const progress = frame / totalFrames

      output.value = chars
        .map((char, i) => {
          if (char === ' ') return ' '
          const charReveal = i / Math.max(chars.length - 1, 1)
          if (progress >= charReveal * 0.75 + 0.2) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      if (frame < totalFrames) {
        rafId = requestAnimationFrame(tick)
      } else {
        output.value = text
        rafId = null
      }
    }

    timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(tick)
    }, delay)
  }

  onUnmounted(() => {
    if (rafId) cancelAnimationFrame(rafId)
    if (timeoutId) clearTimeout(timeoutId)
  })

  return { output, start }
}
