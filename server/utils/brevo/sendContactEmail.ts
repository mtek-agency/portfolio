import { useBrevo } from '~~/server/services/brevo.service'
import type { ContactEmailParams } from '#shared/types/brevo.type'

export async function sendContactEmail({ name, email, message }: ContactEmailParams): Promise<void> {
    const config = useRuntimeConfig()
    const brevo = useBrevo()

    return await brevo.sendTemplateEmail({
        to: config.brevo.contactEmail,
        templateId: 2,
        params: {
            NAME: name,
            EMAIL: email,
            MESSAGE: message,
            DATE: new Date().toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        },
        replyTo: {
            name,
            email
        }
    })
}