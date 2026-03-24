import { projectService } from '~~/server/services/project.service'
import { projectViewService } from '~~/server/services/project.views.service'

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug requis' })

    const project = await projectService.findBySlug(slug)
    if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

    await projectViewService.record(project.id)
    return { ok: true }
})
