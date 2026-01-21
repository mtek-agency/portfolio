import { projectService } from '~~/server/services/project.service'
import type { Project, ProjectImage } from '~~/server/db/schema'

export async function ensureProjectExists(slug: string): Promise<Project & { images: ProjectImage[] }> {
    const project = await projectService.findBySlug(slug)
    if (!project) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Project not found',
        })
    }
    return project
}
