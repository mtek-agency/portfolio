export function useDeleteConfirm<T>() {
  const open = ref(false)
  const item = ref<T | null>(null)
  const loading = ref(false)

  function request(target: T) {
    item.value = target
    open.value = true
  }

  function cancel() {
    item.value = null
    open.value = false
  }

  async function confirm(handler: (target: T) => Promise<void>) {
    if (!item.value) return
    loading.value = true
    try {
      await handler(item.value)
      cancel()
    }
    finally {
      loading.value = false
    }
  }

  return { open, item, loading, request, cancel, confirm }
}
