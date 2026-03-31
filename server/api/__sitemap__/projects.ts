import { eq } from 'drizzle-orm'
import { projects } from '~~/server/db/schema'

export default defineEventHandler(async () => {
  const rows = await db.query.projects.findMany({
    where: eq(projects.isDisabled, false),
    columns: { slug: true, updatedAt: true },
  })

  return rows.map(p => ({
    loc: `/projets/${p.slug}`,
    lastmod: p.updatedAt,
    changefreq: 'monthly',
    priority: 0.7,
  }))
})
