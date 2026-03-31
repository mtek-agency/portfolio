import { parcoursService } from '~~/server/services/parcours.service'
import { parcoursCreateSchema } from '#shared/schemas/parcours.schema'

export default defineEventHandler(async (event) => {
    const body = await readValidatedBody(event, b => parcoursCreateSchema.parse(b))
    return await parcoursService.create(body)
})
