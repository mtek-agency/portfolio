import { eq } from 'drizzle-orm'
import { projects } from '~~/server/db/schema'
import type { Project, ProjectInsert, ProjectUpdate } from '~~/server/db/schema'
import type { ProjectImage } from 'hub:db:schema'


export const projectService = {
    async findAll(): Promise<Project[]> {
        return await db.query.projects.findMany()
    },
    async findBySlug(slug: string): Promise<(Project & { images: ProjectImage[] }) | undefined> {
        return await db.query.projects.findFirst({
            where: eq(projects.slug, slug),
            with: {
                images: {
                    orderBy: (images, { asc }) => [asc(images.id)],
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
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(projects.slug, slug))
            .returning()

        return project
    },
    async setDisable(slug: string, isDisabled: boolean): Promise<Project | undefined> {
        const [project] = await db
            .update(projects)
            .set({
                isDisabled,
                updatedAt: new Date(),
            })
            .where(eq(projects.slug, slug))
            .returning()
        return project
    }
}