import type { ApiResponse } from '#shared/types/brevo.type'
import { newsletterSchema } from '#shared/schemas/contact.schema'
import { handleNewsletterSubscription } from '~~/server/utils/services/newsletterService'
import { messageService } from '~~/server/services/message.service'

export default defineEventHandler(async (event): Promise<ApiResponse> => {
    const { email, token } = await readValidatedBody(event, (b) => newsletterSchema.parse(b))

    const turnstile = await verifyTurnstileToken(token)
    if (!turnstile.success) {
        throw createError({ statusCode: 403, statusMessage: 'Vérification anti-spam échouée' })
    }

    event.waitUntil(
        Promise.all([
            handleNewsletterSubscription(email),
            messageService.create({ type: 'newsletter', email }),
        ])
    )

    return { success: true }
})