import { toolService } from '~~/server/services/tool.service'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const tool = await toolService.toggle(id)
    if (!tool) throw createError({ statusCode: 404, statusMessage: 'Tool not found' })
    return tool
})
