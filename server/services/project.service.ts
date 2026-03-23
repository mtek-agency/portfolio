import { eq } from 'drizzle-orm'
import { projects } from '~~/server/db/schema'
import type { Project, ProjectInsert, ProjectUpdate } from '~~/server/db/schema'
import type { ProjectImage } from 'hub:db:schema'
import { blob } from 'hub:blob'

export const projectService = {
    async findAll(): Promise<(Project & { images: { id: number }[] })[]> {
        return await db.query.projects.findMany({
            with: { images: { columns: { id: true } } },
        })
    },
    async findBySlug(slug: string): Promise<(Project & { images: ProjectImage[] }) | undefined> {
        return await db.query.projects.findFirst({
            where: eq(projects.slug, slug),
            with: {
                images: {
                    orderBy: (images, { asc }) => [asc(images.order), asc(images.id)],
                },
            },
        })
    },
    async create(data: ProjectInsert): Promise<Project> {
        const [project] = await db
            .insert(projects)
            .values(data)
            .returning()
        return project
    },
    async update(slug: string, data: ProjectUpdate): Promise<Project | undefined> {
        const [project] = await db
            .update(projects)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(projects.slug, slug))
            .returning()
        return project
    },
    async setDisable(slug: string, isDisabled: boolean): Promise<Project | undefined> {
        const [project] = await db
            .update(projects)
            .set({ isDisabled, updatedAt: new Date() })
            .where(eq(projects.slug, slug))
            .returning()
        return project
    },
    async upsertMany(data: Partial<ProjectInsert>[]): Promise<{ imported: number, skipped: number }> {
        let imported = 0
        let skipped = 0

        for (const item of data) {
            if (!item.name || !item.slug) { skipped++; continue }
            await db
                .insert(projects)
                .values(item as ProjectInsert)
                .onConflictDoUpdate({
                    target: projects.slug,
                    set: { ...item, updatedAt: new Date() },
                })
            imported++
        }

        return { imported, skipped }
    },
    async delete(slug: string): Promise<void> {
        const project = await projectService.findBySlug(slug)
        if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' })

        if (project.images.length > 0) {
            await Promise.all(project.images.map(img => blob.del(img.filename)))
        }

        await db.delete(projects).where(eq(projects.slug, slug))
    },
}