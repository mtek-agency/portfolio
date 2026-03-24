import { findAllPosts } from '~~/server/services/post.service'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  return findAllPosts()
})
