import { findPublishedPostBySlug } from '~~/server/services/post.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const post = await findPublishedPostBySlug(slug)
  if (!post) throw createError({ statusCode: 404, message: 'Article introuvable' })
  return post
})
