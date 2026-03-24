import { eq, desc } from 'drizzle-orm'
import { projects } from '~~/server/db/schema'

export default defineEventHandler(async () => {
  return db.query.projects.findMany({
    where: eq(projects.isDisabled, false),
    columns: {
      id: true,
      name: true,
      slug: true,
      description: true,
      year: true,
      tags: true,
    },
    with: {
      images: {
        columns: { id: true, url: true },
        orderBy: (images, { asc }) => [asc(images.order), asc(images.id)],
        limit: 1,
      },
    },
    orderBy: [desc(projects.year), desc(projects.createdAt)],
  })
})
