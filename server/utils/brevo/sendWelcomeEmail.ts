import { useBrevo } from '~~/server/services/brevo.service'
import type { WelcomeEmailParams } from '#shared/types/brevo.type'

export async function sendWelcomeEmail({ email, name }: WelcomeEmailParams): Promise<void> {
    const brevo = useBrevo()

    return await brevo.sendTemplateEmail({
        to: email,
        templateId: 3,
        params: {
            FIRSTNAME: name || 'Cher lecteur'
        }
    })
}