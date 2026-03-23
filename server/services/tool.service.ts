import { eq, sql } from 'drizzle-orm'
import { tools } from '~~/server/db/schema'
import type { Tool, ToolInsert } from '~~/server/db/schema'

export const toolService = {
    async findAll(): Promise<Tool[]> {
        return await db.query.tools.findMany({
            orderBy: (t, { asc }) => [asc(t.category), asc(t.order), asc(t.id)],
        })
    },
    async create(data: ToolInsert): Promise<Tool> {
        const maxOrderResult = await db
            .select({ max: sql<number>`coalesce(max("order"), -1)::int` })
            .from(tools)
            .where(eq(tools.category, data.category))
        const order = (maxOrderResult[0]?.max ?? -1) + 1
        const [tool] = await db.insert(tools).values({ ...data, order }).returning()
        return tool!
    },
    async update(id: number, data: Partial<ToolInsert>): Promise<Tool | undefined> {
        const [tool] = await db.update(tools).set(data).where(eq(tools.id, id)).returning()
        return tool
    },
    async toggle(id: number): Promise<Tool | undefined> {
        const current = await db.query.tools.findFirst({ where: eq(tools.id, id) })
        if (!current) return undefined
        const [tool] = await db.update(tools).set({ isActive: !current.isActive }).where(eq(tools.id, id)).returning()
        return tool
    },
    async reorder(items: { id: number, category: string, order: number }[]): Promise<void> {
        await Promise.all(
            items.map(({ id, category, order }) =>
                db.update(tools).set({ category, order }).where(eq(tools.id, id))
            )
        )
    },
    async delete(id: number): Promise<void> {
        await db.delete(tools).where(eq(tools.id, id))
    },
}
