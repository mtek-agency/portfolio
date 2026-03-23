import { useBrevo } from '~~/server/services/brevo.service'

export default defineEventHandler(async (event) => {
    const { email } = getQuery(event)
    if (!email || typeof email !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'email query param required' })
    }

    const brevo = useBrevo()
    const id = await brevo.getContactId(email)
    if (!id) return null

    return {
        id,
        url: `https://app.brevo.com/contact/index#contact-${id}`,
    }
})