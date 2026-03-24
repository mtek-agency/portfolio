export function useCommandPalette() {
  const isOpen = useState('command-palette-open', () => false)
  return {
    isOpen,
    open: () => { isOpen.value = true },
    close: () => { isOpen.value = false },
  }
}
