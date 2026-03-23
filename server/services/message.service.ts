import { eq, sql } from 'drizzle-orm'
import { messages } from '~~/server/db/schema'
import type { Message, MessageInsert } from '~~/server/db/schema'

export const messageService = {
    async findAll(): Promise<Message[]> {
        return await db.query.messages.findMany({
            orderBy: (m, { desc }) => [desc(m.createdAt)],
        })
    },
    async getStats(since?: Date): Promise<{
        unread: number
        total: number
        newsletter: number
        newSince: number
        lastMessage: Message | null
    }> {
        const [agg, lastMessage] = await Promise.all([
            db.select({
                unread: sql<number>`sum(case when "isRead" = false then 1 else 0 end)::int`,
                total: sql<number>`count(*)::int`,
                newsletter: sql<number>`sum(case when "type" = 'newsletter' then 1 else 0 end)::int`,
                newSince: since
                    ? sql<number>`sum(case when "createdAt" >= ${since.toISOString()} then 1 else 0 end)::int`
                    : sql<number>`0`,
            }).from(messages),
            db.query.messages.findFirst({
                orderBy: (m, { desc }) => [desc(m.createdAt)],
            }),
        ])
        const row = agg[0]
        return {
            unread: row?.unread ?? 0,
            total: row?.total ?? 0,
            newsletter: row?.newsletter ?? 0,
            newSince: row?.newSince ?? 0,
            lastMessage: lastMessage ?? null,
        }
    },
    async countUnread(): Promise<number> {
        const result = await db
            .select({ count: sql<number>`count(*)::int` })
            .from(messages)
            .where(eq(messages.isRead, false))
        return result[0]?.count ?? 0
    },
    async create(data: MessageInsert): Promise<Message> {
        const [msg] = await db.insert(messages).values(data).returning()
        return msg!
    },
    async markRead(id: number): Promise<Message | undefined> {
        const [msg] = await db
            .update(messages)
            .set({ isRead: true })
            .where(eq(messages.id, id))
            .returning()
        return msg
    },
    async markAllRead(): Promise<void> {
        await db
            .update(messages)
            .set({ isRead: true })
            .where(eq(messages.isRead, false))
    },
}