import { togglePostFeatured } from '~~/server/services/post.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const slug = getRouterParam(event, 'slug')!
  return togglePostFeatured(slug)
})
