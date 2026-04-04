export const usePreloader = () => {
  const isDone = useState<boolean>('preloader:done', () => false)

  const complete = () => {
    isDone.value = true
  }

  return {
    isDone: computed(() => isDone.value),
    complete,
  }
}
