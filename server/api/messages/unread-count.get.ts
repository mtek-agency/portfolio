import { messageService } from '~~/server/services/message.service'

export default defineEventHandler(async () => {
    return await messageService.countUnread()
})