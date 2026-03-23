import type { ApiResponse } from '#shared/types/brevo.type'
import { handleNewsletterSubscription } from '~~/server/utils/services/newsletterService'
import { contactSchema } from '#shared/schemas/contact.schema'
import { sendContactEmail } from '~~/server/utils/brevo/sendContactEmail'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    const { name, email, message, newsletter, token } = await readValidatedBody(event, (b) => contactSchema.parse(b))

    const turnstile = await verifyTurnstileToken(token)
    if (!turnstile.success) {
        throw createError({ statusCode: 403, statusMessage: 'Vérification anti-spam échouée' })
    }

    await sendContactEmail({ name, email, message })

    if (newsletter) {
        event.waitUntil(handleNewsletterSubscription(email, name))
    }

    return { success: true }
})
