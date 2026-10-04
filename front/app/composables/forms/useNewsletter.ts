import { emailSchema } from '#shared/schemas/contact.schema'

/** Inscription à la newsletter (pied de page et fin d'article) : saisie, validation, envoi et jeton anti-robot. */
export function useNewsletter() {
  const captcha = useCaptcha()
  const email = ref('')
  const sending = ref(false)
  const done = ref(false)
  const err = ref('')

  async function subscribe() {
    if (!email.value || !captcha.token.value) return
    if (!emailSchema.safeParse(email.value).success) {
      err.value = 'Adresse e-mail invalide.'
      return
    }
    sending.value = true
    err.value = ''
    try {
      await $fetch('/api/newsletter', {
        method: 'POST',
        body: { email: email.value, token: captcha.token.value },
      })
      done.value = true
    }
    catch {
      err.value = 'Une erreur est survenue. Réessayez.'
    }
    finally {
      sending.value = false
      captcha.renew()
    }
  }

  return { ...captcha, email, sending, done, err, subscribe }
}
