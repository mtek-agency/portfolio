import { toolService } from '~~/server/services/tool.service'
import { toolUpdateSchema } from '#shared/schemas/tool.schema'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readValidatedBody(event, b => toolUpdateSchema.parse(b))
    const tool = await toolService.update(id, body)
    if (!tool) throw createError({ statusCode: 404, statusMessage: 'Tool not found' })
    return tool
})
