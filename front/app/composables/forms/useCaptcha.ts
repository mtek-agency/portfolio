// Jeton Turnstile d'un formulaire. Un jeton ne sert qu'une fois : après chaque envoi (réussi ou non)
// on le jette et on relance le widget, sinon un nouvel essai serait refusé. Si le widget ne peut pas
// s'afficher (bloqueur de publicités, réseau), `failed` permet d'en avertir le visiteur.
export function useCaptcha() {
  const token = ref('')
  const failed = ref(false)
  const widget = ref<{ reset: () => void } | null>(null)

  const options = {
    size: 'invisible',
    // Le code d'erreur Cloudflare (ex. 110200 domaine non autorisé, 400020 clé invalide) distingue
    // une mauvaise configuration d'un vrai blocage côté visiteur : on le garde dans la console.
    'error-callback': (code?: string) => {
      console.warn('[turnstile] erreur du widget', code)
      failed.value = true
      token.value = ''
    },
    'expired-callback': () => { token.value = '' },
  }

  function renew() {
    token.value = ''
    widget.value?.reset()
  }

  return { token, failed, widget, options, renew }
}
