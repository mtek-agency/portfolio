import { sql, eq, inArray } from 'drizzle-orm'
import { projectViews, projects } from '~~/server/db/schema'

export type ViewTimelinePoint = { month: string, views: number }
export type ProjectViewSummary = { projectId: number, name: string, slug: string, views: number }
export type BreakdownProject = { id: number, name: string, slug: string }
export type BreakdownPoint = { month: string, total: number, byProject: Record<number, number> }
export type BreakdownData = { projects: BreakdownProject[], timeline: BreakdownPoint[] }

export const projectViewService = {
    async record(projectId: number): Promise<void> {
        await db.insert(projectViews).values({ projectId })
    },

    async getTimeline(): Promise<ViewTimelinePoint[]> {
        const rows = await db
            .select({
                month: sql<string>`TO_CHAR(DATE_TRUNC('month', "viewedAt"), 'YYYY-MM')`,
                views: sql<number>`COUNT(*)::int`,
            })
            .from(projectViews)
            .where(sql`"viewedAt" >= NOW() - INTERVAL '12 months'`)
            .groupBy(sql`DATE_TRUNC('month', "viewedAt")`)
            .orderBy(sql`DATE_TRUNC('month', "viewedAt")`)

        const map = Object.fromEntries(rows.map(r => [r.month, r.views]))

        // Fill all 12 months including those with 0 views
        return Array.from({ length: 12 }, (_, i) => {
            const d = new Date()
            d.setDate(1)
            d.setMonth(d.getMonth() - (11 - i))
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            return { month: key, views: map[key] ?? 0 }
        })
    },

    async getTotalByProject(): Promise<Record<number, number>> {
        const rows = await db
            .select({
                projectId: projectViews.projectId,
                views: sql<number>`COUNT(*)::int`,
            })
            .from(projectViews)
            .groupBy(projectViews.projectId)

        return Object.fromEntries(rows.map(r => [r.projectId, r.views]))
    },

    async getTotalForProject(projectId: number): Promise<number> {
        const [row] = await db
            .select({ views: sql<number>`COUNT(*)::int` })
            .from(projectViews)
            .where(eq(projectViews.projectId, projectId))
        return row?.views ?? 0
    },

    async getTotalViews(): Promise<number> {
        const [row] = await db.select({ total: sql<number>`COUNT(*)::int` }).from(projectViews)
        return row?.total ?? 0
    },

    async getBreakdown(): Promise<BreakdownData> {
        const months = Array.from({ length: 12 }, (_, i) => {
            const d = new Date()
            d.setDate(1)
            d.setMonth(d.getMonth() - (11 - i))
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        })

        const rows = await db
            .select({
                month: sql<string>`TO_CHAR(DATE_TRUNC('month', "viewedAt"), 'YYYY-MM')`,
                projectId: projectViews.projectId,
                views: sql<number>`COUNT(*)::int`,
            })
            .from(projectViews)
            .where(sql`"viewedAt" >= NOW() - INTERVAL '12 months'`)
            .groupBy(sql`DATE_TRUNC('month', "viewedAt")`, projectViews.projectId)
            .orderBy(sql`DATE_TRUNC('month', "viewedAt")`)

        const projectIds = [...new Set(rows.map(r => r.projectId))]
        const projectList: BreakdownProject[] = projectIds.length > 0
            ? await db
                .select({ id: projects.id, name: projects.name, slug: projects.slug })
                .from(projects)
                .where(inArray(projects.id, projectIds))
            : []

        const byMonthProject: Record<string, Record<number, number>> = {}
        for (const row of rows) {
            if (!byMonthProject[row.month]) byMonthProject[row.month] = {}
            byMonthProject[row.month][row.projectId] = row.views
        }

        const timeline: BreakdownPoint[] = months.map(month => {
            const byProject = byMonthProject[month] ?? {}
            const total = Object.values(byProject).reduce((s, v) => s + v, 0)
            return { month, total, byProject }
        })

        return { projects: projectList, timeline }
    },
}