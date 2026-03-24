import { projectViewService } from '~~/server/services/project.views.service'

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    return await projectViewService.getTimeline()
})