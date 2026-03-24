import { ilike, or } from 'drizzle-orm'
import { projects, posts, tools } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const { q } = getQuery(event)
  if (!q || typeof q !== 'string' || q.trim().length < 1) {
    return { projects: [], posts: [], tools: [] }
  }

  const pattern = `%${q.trim()}%`

  const [projectResults, postResults, toolResults] = await Promise.all([
    db.select({ id: projects.id, name: projects.name, slug: projects.slug })
      .from(projects)
      .where(or(ilike(projects.name, pattern), ilike(projects.slug, pattern)))
      .limit(5),
    db.select({ id: posts.id, title: posts.title, slug: posts.slug, status: posts.status })
      .from(posts)
      .where(or(ilike(posts.title, pattern), ilike(posts.slug, pattern)))
      .limit(5),
    db.select({ id: tools.id, name: tools.name })
      .from(tools)
      .where(ilike(tools.name, pattern))
      .limit(5),
  ])

  return { projects: projectResults, posts: postResults, tools: toolResults }
})
