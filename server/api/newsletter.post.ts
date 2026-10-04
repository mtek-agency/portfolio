import { newsletterSchema } from '#shared/schemas/contact.schema'

export default defineEventHandler(async (event) => {
  const { email, token } = await readValidatedBody(event, b => newsletterSchema.parse(b))

  await studioFetch(event, '/newsletter-subscriptions', {
    method: 'POST',
    body: { email, turnstile_token: token },
  })
  return { success: true }
})
