import { projectService } from '~~/server/services/project.service'
import type { Project, ProjectInsert } from '~~/server/db/schema'
import { createProjectSchema } from '~~/shared/schemas/project.schema'

export default defineEventHandler(async (event): Promise<Project> => {
    await requireUserSession(event)

    const body: ProjectInsert = await readBody<ProjectInsert>(event)
    const validationResult = createProjectSchema.safeParse(body)
    if (!validationResult.success) {
        throw createError({
            statusCode: 400,
            statusMessage: "Validation failed",
            data: validationResult.error.message,
        })
    }

    try {
        return await projectService.create(validationResult.data)
    } catch (error: any) {
        if (error.cause?.code === '23505') throw createError({ statusCode: 409, statusMessage: "Project already exists" })
        throw createError({
            statusCode: 500,
            statusMessage: "Failed to create project",
            data: error.cause
        })
    }
})