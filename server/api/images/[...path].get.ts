import { blob } from 'hub:blob'

export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path')
    if (!path) throw createError({ statusCode: 400, statusMessage: 'Image path is required' })

    const file = await blob.get(path)
    if (!file) throw createError({ statusCode: 404, statusMessage: 'Image not found' })

    return file
})

