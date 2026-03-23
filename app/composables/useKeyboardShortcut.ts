type ShortcutOptions = {
  meta?: boolean  // Cmd (Mac) ou Ctrl (Windows)
  shift?: boolean
  prevent?: boolean
}

export function useKeyboardShortcut(
  key: string,
  handler: (event: KeyboardEvent) => void,
  options: ShortcutOptions = {},
) {
  const { meta = false, shift = false, prevent = true } = options

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== key) return
    if (meta && !(event.metaKey || event.ctrlKey)) return
    if (!meta && (event.metaKey || event.ctrlKey)) return
    if (shift && !event.shiftKey) return

    if (prevent) event.preventDefault()
    handler(event)
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}
