export function useBrevoContact() {
  const brevoUrl = ref<string | null>(null)
  const loadingBrevo = ref(false)

  async function fetchBrevoContact(email: string): Promise<void> {
    brevoUrl.value = null
    loadingBrevo.value = true
    try {
      const result = await $fetch<{ id: number } | null>(`/api/brevo/contact?email=${encodeURIComponent(email)}`)
      brevoUrl.value = result ? `https://app.brevo.com/contact/index/${result.id}` : null
    }
    catch {
      brevoUrl.value = null
    }
    finally {
      loadingBrevo.value = false
    }
  }

  return { brevoUrl, loadingBrevo, fetchBrevoContact }
}