import { parcoursService } from '~~/server/services/parcours.service'

export default defineEventHandler(async () => {
    return await parcoursService.findActive()
})
