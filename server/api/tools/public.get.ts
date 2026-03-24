import { toolService } from '~~/server/services/tool.service'

export default defineEventHandler(async () => {
    return await toolService.findPublic()
})