import { blob } from 'hub:blob'
import { eq } from 'drizzle-orm'
import { posts } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const slug = getRouterParam(event, 'slug')!

  const formData = await readMultipartFormData(event)
  const file = formData?.find(f => f.name === 'cover')
  if (!file?.data) throw createError({ statusCode: 400, statusMessage: 'Fichier requis' })

  const extension = file.filename?.split('.').pop() || 'jpg'
  const filename = `blog/covers/${slug}-${Date.now()}.${extension}`

  const blobResult = await blob.put(filename, file.data, { contentType: file.type })

  const [updated] = await db.update(posts)
    .set({ coverImage: blobResult.pathname, updatedAt: new Date() })
    .where(eq(posts.slug, slug))
    .returning()

  return updated
})
