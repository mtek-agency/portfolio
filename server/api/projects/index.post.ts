import { projectService } from '~~/server/services/project.service'
import type { Project } from '~~/server/db/schema'
import { createProjectSchema } from '~~/shared/schemas/project.schema'

export default defineEventHandler(async (event): Promise<Project> => {
    await requireUserSession(event)
    const body = await readValidatedBody(event, (b) => createProjectSchema.parse(b))

    return projectService.create(body).catch((error: any) => {
        if (error.cause?.code === '23505') throw createError({ statusCode: 409, statusMessage: 'Project already exists' })
        throw createError({ statusCode: 500, statusMessage: 'Failed to create project', data: error.cause })
    })
})