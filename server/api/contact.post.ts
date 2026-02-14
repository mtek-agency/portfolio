import { isH3Error } from '~~/server/utils/errorHelpers'
import type { ApiResponse, ContactEmailParams } from '#shared/types/brevo.type'
import { handleNewsletterSubscription } from '~~/server/utils/services/newsletterService'
import { contactSchema } from '#shared/schemas/contact.schema'
import { sendContactEmail } from '~~/server/utils/brevo/sendContactEmail'
import { z } from 'zod'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    try {
        const body = await readBody<ContactEmailParams>(event)
        const { name, email, message, newsletter, token } = contactSchema.parse(body)

        const turnstile = await verifyTurnstileToken(token)
        if (!turnstile.success) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Vérification anti-spam échouée'
            })
        }

        await sendContactEmail({ name, email, message })


        if (newsletter) {
            event.waitUntil(
                handleNewsletterSubscription(email, name)
            )
        }

        return {
            success: true
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Données invalides',
                data: error
            })
        }
        if (isH3Error(error)) {
            throw error
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de l\'envoi du message'
        })
    }
})
