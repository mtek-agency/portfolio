import { z } from 'zod'
import { getValidatedSlug } from '~~/server/utils/params'
import { ensureProjectExists } from '~~/server/utils/projects'
import { imageService } from '~~/server/services/image.service'

const reorderSchema = z.object({
    ids: z.array(z.number()).min(1),
})

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const slug = getValidatedSlug(event)
    await ensureProjectExists(slug)
    const { ids } = await readValidatedBody(event, b => reorderSchema.parse(b))
    await imageService.reorder(ids)
    return { success: true }
})