import { eq } from 'drizzle-orm'
import { posts } from '~~/server/db/schema'

export default defineEventHandler(async () => {
  const rows = await db.query.posts.findMany({
    where: eq(posts.status, 'published'),
    columns: { slug: true, updatedAt: true, publishedAt: true },
  })

  return rows.map(p => ({
    loc: `/blog/${p.slug}`,
    lastmod: p.updatedAt,
    changefreq: 'weekly',
    priority: 0.8,
  }))
})
