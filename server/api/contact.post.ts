import { contactSchema } from '#shared/schemas/contact.schema'

// Idempotency-Key : fournie par le formulaire, elle évite d'enregistrer deux fois un message réessayé.
export default defineEventHandler(async (event) => {
  const { name, email, message, newsletter, token } = await readValidatedBody(event, b => contactSchema.parse(b))
  const key = getRequestHeader(event, 'idempotency-key')

  await studioFetch(event, '/contact-messages', {
    method: 'POST',
    headers: key ? { 'Idempotency-Key': key } : undefined,
    body: { name, email, message, newsletter: newsletter ?? false, turnstile_token: token },
  })
  return { success: true }
})
