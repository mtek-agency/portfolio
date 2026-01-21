import type { Project } from '~~/server/db/schema'
import { getValidatedSlug } from '~~/server/utils/params'
import { ensureProjectExists } from '~~/server/utils/projects'

export default defineEventHandler(async (event): Promise<Project> => {
    const slug = getValidatedSlug(event)
    return await ensureProjectExists(slug)
})