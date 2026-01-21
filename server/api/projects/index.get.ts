import { projectService } from '~~/server/services/project.service'
import type { Project } from '~~/server/db/schema'

export default defineEventHandler(async (_event): Promise<Project[]> => {
    return await projectService.findAll()
})