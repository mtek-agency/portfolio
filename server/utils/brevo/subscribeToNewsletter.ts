import { useBrevo } from '~~/server/services/brevo.service'
import type { NewsletterSubscribeParams } from '#shared/types/brevo.type'

export async function subscribeToNewsletter({ email, name, newsletter }: NewsletterSubscribeParams) {
    const brevo = useBrevo()

    await brevo.addContact({
        email,
        attributes: {
            PRENOM: name || '',
            DATE_INSCRIPTION: new Date().toISOString(),
            SUBSCRIBE_CAMPAGNE: !!newsletter
        }
    })

    return { email, name }
}