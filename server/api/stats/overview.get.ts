import { sql, desc, eq } from 'drizzle-orm'
import { projects, projectViews, posts, postViews } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const [topProjects, topPosts, totalPV, totalPOV] = await Promise.all([
    db.select({
      id: projects.id,
      name: projects.name,
      slug: projects.slug,
      views: sql<number>`COUNT(${projectViews.id})::int`,
    })
      .from(projects)
      .leftJoin(projectViews, eq(projectViews.projectId, projects.id))
      .groupBy(projects.id, projects.name, projects.slug)
      .orderBy(desc(sql`COUNT(${projectViews.id})`))
      .limit(8),

    db.select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      views: sql<number>`COUNT(${postViews.id})::int`,
    })
      .from(posts)
      .leftJoin(postViews, eq(postViews.postId, posts.id))
      .where(eq(posts.status, 'published'))
      .groupBy(posts.id, posts.title, posts.slug)
      .orderBy(desc(sql`COUNT(${postViews.id})`))
      .limit(8),

    db.select({ count: sql<number>`COUNT(*)::int` }).from(projectViews),
    db.select({ count: sql<number>`COUNT(*)::int` }).from(postViews),
  ])

  return {
    topProjects,
    topPosts,
    totalProjectViews: totalPV[0]?.count ?? 0,
    totalPostViews: totalPOV[0]?.count ?? 0,
  }
})
