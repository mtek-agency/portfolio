import { imageService } from '~~/server/services/image.service'
import { getValidatedId } from '~~/server/utils/params'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const id = getValidatedId(event)

    const image = await imageService.findById(id)
    if (!image) throw createError({ statusCode: 404, statusMessage: "Image not found" })

    await imageService.deleteById(image.id, image.filename)
    return { success: true }
})

