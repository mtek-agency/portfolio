import { eq, sql } from 'drizzle-orm'
import { parcours } from '~~/server/db/schema'
import type { Parcours, ParcoursInsert } from '~~/server/db/schema'

export const parcoursService = {
    async findAll(): Promise<Parcours[]> {
        return await db.query.parcours.findMany({
            orderBy: (p, { asc }) => [asc(p.order), asc(p.id)],
        })
    },
    async findActive(): Promise<Parcours[]> {
        return await db.query.parcours.findMany({
            where: (p, { eq }) => eq(p.isActive, true),
            orderBy: (p, { asc }) => [asc(p.order), asc(p.id)],
        })
    },
    async create(data: Omit<ParcoursInsert, 'order'>): Promise<Parcours> {
        const maxResult = await db
            .select({ max: sql<number>`coalesce(max("order"), -1)::int` })
            .from(parcours)
        const order = (maxResult[0]?.max ?? -1) + 1
        const [item] = await db.insert(parcours).values({ ...data, order }).returning()
        return item!
    },
    async update(id: number, data: Partial<ParcoursInsert>): Promise<Parcours | undefined> {
        const [item] = await db.update(parcours).set(data).where(eq(parcours.id, id)).returning()
        return item
    },
    async toggle(id: number): Promise<Parcours | undefined> {
        const current = await db.query.parcours.findFirst({ where: eq(parcours.id, id) })
        if (!current) return undefined
        const [item] = await db.update(parcours).set({ isActive: !current.isActive }).where(eq(parcours.id, id)).returning()
        return item
    },
    async reorder(items: { id: number, order: number }[]): Promise<void> {
        await Promise.all(
            items.map(({ id, order }) =>
                db.update(parcours).set({ order }).where(eq(parcours.id, id))
            )
        )
    },
    async delete(id: number): Promise<void> {
        await db.delete(parcours).where(eq(parcours.id, id))
    },
}
