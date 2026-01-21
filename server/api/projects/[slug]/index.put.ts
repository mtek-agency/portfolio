import { projectService } from '~~/server/services/project.service'
import type { Project } from '~~/server/db/schema'
import { updateProjectSchema } from '#shared/schemas/project.schema'
import { getValidatedSlug } from '~~/server/utils/params'

export default defineEventHandler(async (event): Promise<Project> => {
    await requireUserSession(event)
    const slug = getValidatedSlug(event)
    const body = await readBody(event)
    const validationResult = updateProjectSchema.safeParse(body)
    if (!validationResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Validation failed",
            data: validationResult.error.message,
        })
    }

    try {
        const project = await projectService.update(slug, validationResult.data)

        if (!project) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Project not found'
            })
        }

        return project
    } catch (error: any) {
        if (error.cause?.code === '23505') throw createError({ statusCode: 409, statusMessage: "Project already exists" })
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to create project",
            data: error.cause
        })
    }
})