import { sql, eq, inArray, desc } from 'drizzle-orm'
import { postViews, posts } from '~~/server/db/schema'

// Reuse same shape as project BreakdownData so the chart component works as-is
export type PostBreakdownData = {
  projects: { id: number, name: string, slug: string }[]
  timeline: { month: string, total: number, byProject: Record<number, number> }[]
  mostPopular: { id: number, title: string, slug: string, views: number } | null
}

export const postViewService = {
  async record(postId: number): Promise<void> {
    await db.insert(postViews).values({ postId })
  },

  async getTotalForPost(postId: number): Promise<number> {
    const [row] = await db
      .select({ views: sql<number>`COUNT(*)::int` })
      .from(postViews)
      .where(eq(postViews.postId, postId))
    return row?.views ?? 0
  },

  async getMostPopular(): Promise<{ id: number, title: string, slug: string, views: number } | null> {
    const rows = await db
      .select({
        postId: postViews.postId,
        views: sql<number>`COUNT(*)::int`,
      })
      .from(postViews)
      .groupBy(postViews.postId)
      .orderBy(desc(sql`COUNT(*)`))
      .limit(1)

    if (!rows.length) return null

    const [post] = await db
      .select({ id: posts.id, title: posts.title, slug: posts.slug })
      .from(posts)
      .where(eq(posts.id, rows[0]!.postId))

    if (!post) return null
    return { ...post, views: rows[0]!.views }
  },

  async getBreakdown(): Promise<PostBreakdownData> {
    const months = Array.from({ length: 12 }, (_, i) => {
      const d = new Date()
      d.setDate(1)
      d.setMonth(d.getMonth() - (11 - i))
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })

    const rows = await db
      .select({
        month: sql<string>`TO_CHAR(DATE_TRUNC('month', "viewedAt"), 'YYYY-MM')`,
        postId: postViews.postId,
        views: sql<number>`COUNT(*)::int`,
      })
      .from(postViews)
      .where(sql`"viewedAt" >= NOW() - INTERVAL '12 months'`)
      .groupBy(sql`DATE_TRUNC('month', "viewedAt")`, postViews.postId)
      .orderBy(sql`DATE_TRUNC('month', "viewedAt")`)

    const postIds = [...new Set(rows.map(r => r.postId))]
    const postList = postIds.length > 0
      ? (await db
          .select({ id: posts.id, name: posts.title, slug: posts.slug })
          .from(posts)
          .where(inArray(posts.id, postIds)))
      : []

    const byMonthPost: Record<string, Record<number, number>> = {}
    for (const row of rows) {
      if (!byMonthPost[row.month]) byMonthPost[row.month] = {}
      byMonthPost[row.month]![row.postId] = row.views
    }

    const timeline = months.map(month => {
      const byProject = byMonthPost[month] ?? {}
      const total = Object.values(byProject).reduce((s, v) => s + v, 0)
      return { month, total, byProject }
    })

    const mostPopular = await this.getMostPopular()

    return { projects: postList, timeline, mostPopular }
  },
}
