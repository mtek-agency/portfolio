import { findPostBySlug } from '~~/server/services/post.service'
import { postViewService } from '~~/server/services/post.views.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const slug = getRouterParam(event, 'slug')!
  const post = await findPostBySlug(slug)
  if (!post) throw createError({ statusCode: 404, message: 'Article introuvable' })
  const views = await postViewService.getTotalForPost(post.id)
  return { views }
})
