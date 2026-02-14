import { subscribeToNewsletter } from '~~/server/utils/brevo/subscribeToNewsletter'
import { sendWelcomeEmail } from '~~/server/utils/brevo/sendWelcomeEmail'

export async function handleNewsletterSubscription(email: string, name: string = ' '): Promise<void> {
    try {
        await subscribeToNewsletter({ email, name, newsletter: true })

        try {
            await sendWelcomeEmail({ email, name })
        } catch (error: any) {
            console.error('[Newsletter] Error sending welcome email:', error.response?.data || error.message)
        }
    } catch (error: any) {
        console.error('[Newsletter] Error subscribing:', error.response?.data || error.message)
    }
}
