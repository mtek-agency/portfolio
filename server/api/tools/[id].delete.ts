import { toolService } from '~~/server/services/tool.service'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    await toolService.delete(id)
})
