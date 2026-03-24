export function useAppToast() {
  const toast = useToast()

  return {
    success: (title: string, description?: string) =>
      toast.add({ title, description, color: 'neutral', icon: 'i-lucide-check' }),
    error: (title: string, description?: string) =>
      toast.add({ title, description, color: 'error', icon: 'i-lucide-x' }),
  }
}
