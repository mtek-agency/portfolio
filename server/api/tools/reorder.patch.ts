import { toolService } from '~~/server/services/tool.service'
import { toolReorderSchema } from '#shared/schemas/tool.schema'

export default defineEventHandler(async (event) => {
    const { items } = await readValidatedBody(event, b => toolReorderSchema.parse(b))
    await toolService.reorder(items)
})
