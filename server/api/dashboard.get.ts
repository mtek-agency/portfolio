import { sql } from 'drizzle-orm'
import { projects } from '~~/server/db/schema'
import { messageService } from '~~/server/services/message.service'

export default defineEventHandler(async (event) => {
    const { since } = getQuery(event)
    const sinceDate = since ? new Date(since as string) : undefined

    const [projectStats, messageStats] = await Promise.all([
        db.select({
            active: sql<number>`sum(case when "isDisabled" = false then 1 else 0 end)::int`,
            disabled: sql<number>`sum(case when "isDisabled" = true then 1 else 0 end)::int`,
        }).from(projects),
        messageService.getStats(sinceDate),
    ])

    return {
        projects: projectStats[0] ?? { active: 0, disabled: 0 },
        messages: messageStats,
    }
})