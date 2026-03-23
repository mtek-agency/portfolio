import { messageService } from '~~/server/services/message.service'

export default defineEventHandler(async () => {
    await messageService.markAllRead()
})