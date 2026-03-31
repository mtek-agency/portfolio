import { parcoursService } from '~~/server/services/parcours.service'
import { parcoursReorderSchema } from '#shared/schemas/parcours.schema'

export default defineEventHandler(async (event) => {
    const { items } = await readValidatedBody(event, b => parcoursReorderSchema.parse(b))
    await parcoursService.reorder(items)
})
