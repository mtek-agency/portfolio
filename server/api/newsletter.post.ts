import { isH3Error } from '~~/server/utils/errorHelpers'
import { z } from 'zod'
import type { ApiResponse } from '#shared/types/brevo.type'
import { newsletterSchema } from '#shared/schemas/contact.schema'
import { handleNewsletterSubscription } from '~~/server/utils/services/newsletterService'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    try {
        const body = await readBody(event)
        const { email, token } = newsletterSchema.parse(body)

        const turnstile = await verifyTurnstileToken(token)
        if (!turnstile.success) {
            throw createError({
                statusCode: 403,
                statusMessage: 'Vérification anti-spam échouée'
            })
        }

        event.waitUntil(
            handleNewsletterSubscription(email)
        )

        return {
            success: true
        }
    } catch (error) {
        console.error('Erreur API newsletter:', error)

        if (error instanceof z.ZodError) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Données invalides',
                data: error
            })
        }

        if (isH3Error(error)) {
            throw createError({
                statusCode: error.statusCode || 500,
                statusMessage: error.statusMessage || 'Erreur lors de l\'envoi du message'
            })
        }
        throw createError({
            statusCode: 500,
            statusMessage: 'Erreur lors de l\'envoi du message'
        })
    }
});