import { projectService } from '~~/server/services/project.service'
import { exportService } from '~~/server/services/export.service'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const projects = await projectService.findAll()

    if (!projects || projects.length === 0) {
        throw createError({
            statusCode: 404,
            statusMessage: 'No projects found'
        })
    }

    const csvContent = exportService.exportProjects(projects)

    setResponseHeaders(event, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${exportService.generateFilename('projects')}"`
    })

    return csvContent
})