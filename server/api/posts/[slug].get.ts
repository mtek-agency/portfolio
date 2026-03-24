import { findPostBySlug } from '~~/server/services/post.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const slug = getRouterParam(event, 'slug')!
  const post = await findPostBySlug(slug)
  if (!post) throw createError({ statusCode: 404, message: 'Article introuvable' })
  return post
})
