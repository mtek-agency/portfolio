import { postCreateSchema } from '#shared/schemas/post.schema'
import { createPost, findPostBySlug } from '~~/server/services/post.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const body = await readValidatedBody(event, postCreateSchema.parse)

  const existing = await findPostBySlug(body.slug)
  if (existing) {
    throw createError({ statusCode: 409, message: 'Un article avec ce slug existe déjà' })
  }

  return createPost(body)
})
