import { postUpdateSchema } from '#shared/schemas/post.schema'
import { updatePost, findPostBySlug } from '~~/server/services/post.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const slug = getRouterParam(event, 'slug')!
  const body = await readValidatedBody(event, postUpdateSchema.parse)

  // Check slug uniqueness if it changed
  if (body.slug !== slug) {
    const existing = await findPostBySlug(body.slug)
    if (existing) {
      throw createError({ statusCode: 409, message: 'Un article avec ce slug existe déjà' })
    }
  }

  return updatePost(slug, body)
})
