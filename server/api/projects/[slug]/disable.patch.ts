import { projectService } from '~~/server/services/project.service'
import type { Project } from '~~/server/db/schema'
import { requireAuthIfNeeded } from '~~/server/utils/auth'
import { getValidatedSlug } from '~~/server/utils/params'

export default defineEventHandler(async (event) => {
    await requireAuthIfNeeded(event)

    const slug = getValidatedSlug(event)

    const body = await readBody<{ isDisabled: boolean }>(event)
    if (body === null || body === undefined || typeof body.isDisabled !== 'boolean') {
        throw createError({
            statusCode: 400,
            statusMessage: 'isDisabled must be a boolean'
        })
    }

    const project: Project | undefined = await projectService.setDisable(slug, body.isDisabled)

    if (!project) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found'
        })
    }

    return project
})