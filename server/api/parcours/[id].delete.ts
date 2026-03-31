import { parcoursService } from '~~/server/services/parcours.service'

export default defineEventHandler(async (event) => {
    const id = Number(getRouterParam(event, 'id'))
    await parcoursService.delete(id)
})
