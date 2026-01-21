import { blob } from 'hub:blob'
import { getValidatedSlug } from '~~/server/utils/params'

export default defineEventHandler(async (event) => {
    const slug = getValidatedSlug(event)
    const file = await blob.get(slug)
    if (!file) throw createError({ statusCode: 404, statusMessage: "Image not found" })
    return file
})

