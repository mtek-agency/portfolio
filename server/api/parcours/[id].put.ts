import { parcoursService } from '~~/server/services/parcours.service'
import { parcoursUpdateSchema } from '#shared/schemas/parcours.schema'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    const body = await readValidatedBody(event, b => parcoursUpdateSchema.parse(b))
    const item = await parcoursService.update(id, body)
    if (!item) throw createError({ statusCode: 404, statusMessage: 'Parcours not found' })
    return item
})
