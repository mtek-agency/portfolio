import { exportService } from '~~/server/services/export.service'
import { projectService } from '~~/server/services/project.service'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const formData = await readMultipartFormData(event)
    const file = formData?.find(f => f.name === 'file')

    if (!file?.data) throw createError({ statusCode: 400, statusMessage: 'Fichier manquant' })

    const csvContent = new TextDecoder().decode(file.data)

    let projectsData
    try {
        projectsData = exportService.parseProjectsCsv(csvContent)
    }
    catch {
        throw createError({ statusCode: 422, statusMessage: 'Fichier CSV invalide' })
    }

    const result = await projectService.upsertMany(projectsData)

    return result
})