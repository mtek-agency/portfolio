import { z } from 'zod'

export const createProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    year: z.string().min(4, "Year must be valid"),
    slug: z.string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
    urlWebsite: z.string().url().optional().or(z.literal('')).or(z.undefined()),
    urlRepository: z.string().url().optional().or(z.literal('')).or(z.undefined()),
    tags: z.string().optional(),
    stack: z.string().optional(),
    isDisabled: z.boolean().default(false),
})
export const updateProjectSchema = createProjectSchema.partial()


export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>