import { findPublishedPostBySlug } from '~~/server/services/post.service'
import { postViewService } from '~~/server/services/post.views.service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const post = await findPublishedPostBySlug(slug)
  if (!post) return { ok: false }
  await postViewService.record(post.id)
  return { ok: true }
})
