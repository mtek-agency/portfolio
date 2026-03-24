import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)
  const formData = await readMultipartFormData(event)
  const file = formData?.find(f => f.name === 'image')
  if (!file?.data) throw createError({ statusCode: 400, statusMessage: 'Fichier requis' })

  const extension = file.filename?.split('.').pop() || 'jpg'
  const filename = `blog/images/${Date.now()}.${extension}`

  const blobResult = await blob.put(filename, file.data, { contentType: file.type })

  return { url: `/api/images/${blobResult.pathname}` }
})
