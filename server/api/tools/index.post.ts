import { toolService } from '~~/server/services/tool.service'
import { toolCreateSchema } from '#shared/schemas/tool.schema'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, b => toolCreateSchema.parse(b))
    return await toolService.create(body)
})
