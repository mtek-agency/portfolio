import { imageService } from '~~/server/services/image.service'
import { readMultipartFormData } from 'h3'
import { getValidatedSlug } from '~~/server/utils/params'
import { ensureProjectExists } from '~~/server/utils/projects'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const slug = getValidatedSlug(event)
    const project = await ensureProjectExists(slug)

    const formData = await readMultipartFormData(event)
    if (!formData) throw createError({ statusCode: 400, statusMessage: 'Invalid form data' })
    const images = formData.filter(
        (item) => item.name === 'images' && item.data
    )

    if (!images.length) {
        throw createError({ statusCode: 400, statusMessage: 'No images provided' })
    }

    const results = await Promise.all(
        images.map(async (image, index) => imageService.uploadProjectImage(
            project.id,
            slug,
            image,
            index
        ))
    )

    return {
        success: true,
        results,
    }
})

