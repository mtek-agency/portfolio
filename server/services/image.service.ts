import { blob } from 'hub:blob'
import type { ProjectImage } from '~~/server/db/schema'
import { projectImages } from '~~/server/db/schema'
import { db } from 'hub:db'
import { eq } from 'drizzle-orm'


export const imageService = {
    async uploadProjectImage(projectId: number, slug: string, image, order: int = 0): Promise<ProjectImage> {
        const extension = image.filename?.split('.').pop() || 'png'

        const filename = `projects/${slug}/${Date.now()}-${image.name}.${extension}`
        const blobResult = await blob.put(filename, image.data, {
            contentType: image.type,
        })

        const [createdImage] = await db
            .insert(projectImages)
            .values({
                projectId,
                url: blobResult.pathname,
                filename,
                mimeType: extension,
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
         await db
            .delete(projectImages)
            .where(eq(projectImages.id, Number(id)))
            .returning()
        await blob.del(filename)
    }
}