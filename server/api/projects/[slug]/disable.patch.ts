import { projectService } from '~~/server/services/project.service'
import { getValidatedSlug } from '~~/server/utils/params'
import { z } from 'zod'

const disableSchema = z.object({ isDisabled: z.boolean() })

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const slug = getValidatedSlug(event)
    const { isDisabled } = await readValidatedBody(event, (b) => disableSchema.parse(b))

    const project = await projectService.setDisable(slug, isDisabled)
    if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

    return project
})