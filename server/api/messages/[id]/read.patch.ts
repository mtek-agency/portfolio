import { messageService } from '~~/server/services/message.service'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const msg = await messageService.markRead(Number(id))
    if (!msg) throw createError({ statusCode: 404, statusMessage: 'Message not found' })
    return msg
})