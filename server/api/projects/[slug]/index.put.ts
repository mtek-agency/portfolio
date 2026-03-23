import { projectService } from '~~/server/services/project.service'
import type { Project } from '~~/server/db/schema'
import { updateProjectSchema } from '#shared/schemas/project.schema'
import { getValidatedSlug } from '~~/server/utils/params'

export default defineEventHandler(async (event): Promise<Project> => {
    await requireUserSession(event)
    const slug = getValidatedSlug(event)
    const body = await readValidatedBody(event, (b) => updateProjectSchema.parse(b))

    const project = await projectService.update(slug, body).catch((error: any) => {
        if (error.cause?.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Project already exists' })
        throw createError({ statusCode: 500, statusMessage: 'Failed to update project', data: error.cause })
    })

    if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

    return project
})