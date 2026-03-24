import { findPublishedPosts } from '~~/server/services/post.service'

export default defineEventHandler(() => {
  return findPublishedPosts()
})
