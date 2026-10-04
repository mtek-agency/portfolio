const STICKY_TOP = 88
const STACK_GAP = 16
const ROTATIONS = [-1.8, 1.4, -2.2, 0.9, -1.5, 2.0, -0.8, 1.6, -2.4, 1.1]

export function useStackCards(count: Ref<number> | ComputedRef<number>) {
  const cardEls = ref<(HTMLElement | null)[]>([])
  const scales = ref<number[]>([])
  const rotations = ref<number[]>([])

  const cardStyle = (index: number) => ({
    position: 'sticky' as const,
    top: `${STICKY_TOP + index * STACK_GAP}px`,
    zIndex: index + 1,
    transform: `scale(${scales.value[index] ?? 1}) rotate(${rotations.value[index] ?? 0}deg)`,
    transformOrigin: 'top center',
    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
  })

  onMounted(() => {
    scales.value = Array(count.value).fill(1)
    rotations.value = Array(count.value).fill(0)

    let raf = 0

    const update = () => {
      for (let i = 0; i < count.value; i++) {
        const el = cardEls.value[i]
        if (!el) { scales.value[i] = 1; rotations.value[i] = 0; continue }

        const stickyAt = STICKY_TOP + i * STACK_GAP
        const isStuck = el.getBoundingClientRect().top <= stickyAt + 2

        if (!isStuck) { scales.value[i] = 1; rotations.value[i] = 0; continue }

        let above = 0
        for (let j = i + 1; j < count.value; j++) {
          const jEl = cardEls.value[j]
          if (!jEl) continue
          if (jEl.getBoundingClientRect().top <= STICKY_TOP + j * STACK_GAP + 2) above++
        }

        scales.value[i] = Math.max(0.88, 1 - above * 0.025)
        rotations.value[i] = above > 0 ? (ROTATIONS[i % ROTATIONS.length] ?? 1.2) * Math.min(1, above * 0.6) : 0
      }
    }

    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    onUnmounted(() => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) })
  })

  return { cardEls, scales, rotations, cardStyle, STICKY_TOP, STACK_GAP }
}
