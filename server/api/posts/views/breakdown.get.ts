import { postViewService } from '~~/server/services/post.views.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  return postViewService.getBreakdown()
})
