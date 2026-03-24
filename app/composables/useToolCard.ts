export function useToolCard() {
  const colorMode = useColorMode()
  const tilts = reactive<Record<number, string>>({})
  const spots = reactive<Record<number, { x: number; y: number }>>({})

  function onMouseMove(e: MouseEvent, id: number) {
    const el = e.currentTarget as HTMLElement
    const { left, top, width, height } = el.getBoundingClientRect()
    const nx = (e.clientX - left) / width
    const ny = (e.clientY - top) / height
    tilts[id] = `perspective(700px) rotateX(${(-(ny - 0.5) * 14).toFixed(1)}deg) rotateY(${((nx - 0.5) * 20).toFixed(1)}deg) scale3d(1.03,1.03,1.03)`
    spots[id] = { x: nx * 100, y: ny * 100 }
  }

  function onMouseLeave(id: number) {
    delete tilts[id]
    delete spots[id]
  }

  function cardStyle(id: number, visible: boolean, index: number) {
    const spotColor = colorMode.value === 'dark'
      ? 'rgba(255,255,255,0.07)'
      : 'rgba(0,0,0,0.05)'

    return {
      transitionDelay: tilts[id] ? '0ms' : (visible ? `${index * 50}ms` : '0ms'),
      transform: tilts[id] ?? undefined,
      transition: tilts[id]
        ? 'transform 0.08s ease-out'
        : 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease',
      backgroundImage: spots[id]
        ? `radial-gradient(circle at ${spots[id].x}% ${spots[id].y}%, ${spotColor} 0%, transparent 65%)`
        : undefined,
    }
  }

  return { tilts, spots, onMouseMove, onMouseLeave, cardStyle }
}
