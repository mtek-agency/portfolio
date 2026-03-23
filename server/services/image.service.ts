import { blob } from 'hub:blob'
import type { ProjectImage } from '~~/server/db/schema'
import { projectImages } from '~~/server/db/schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'
import type { MultiPartData } from 'h3'


export const imageService = {
    async uploadProjectImage(projectId: number, slug: string, image: MultiPartData, order: number = 0): Promise<ProjectImage> {
        const extension = image.filename?.split('.').pop() || 'png'
        const originalName = image.filename?.replace(/\.[^.]+$/, '') || `image-${order}`

        const filename = `projects/${slug}/${Date.now()}-${originalName}.${extension}`
        const blobResult = await blob.put(filename, image.data, {
            contentType: image.type,
        })

        const [createdImage] = await db
            .insert(projectImages)
            .values({
                projectId,
                url: blobResult.pathname,
                filename,
                mimeType: image.type ?? extension,
                size: blobResult.size,
                order,
            })
            .returning()

        return createdImage
    },
    async findById(id: number): Promise<ProjectImage | undefined> {
        return await db.query.projectImages.findFirst({
            where: eq(projectImages.id, id)
        })
    },
    async deleteById(id: number, filename: string): Promise<void> {
        await db.delete(projectImages).where(eq(projectImages.id, id))
        await blob.del(filename)
    },
    async reorder(ids: number[]): Promise<void> {
        await Promise.all(
            ids.map((id, index) =>
                db.update(projectImages).set({ order: index }).where(eq(projectImages.id, id))
            )
        )
    }
}