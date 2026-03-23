import { getValidatedSlug } from '~~/server/utils/params'
import { projectService } from '~~/server/services/project.service'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const slug = getValidatedSlug(event)
    await projectService.delete(slug)
    return { success: true }
})