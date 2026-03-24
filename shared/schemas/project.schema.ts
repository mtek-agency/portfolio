import { z } from 'zod'

const slugField = z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9-]+$/, 'Slug invalide (minuscules, chiffres, tirets uniquement)')

export const minimalCreateProjectSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    slug: slugField,
})

export const createProjectSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().default(''),
    year: z.string().default(() => String(new Date().getFullYear())),
    slug: slugField,
    urlWebsite: z.string().url().optional().or(z.literal('')).or(z.undefined()),
    urlRepository: z.string().url().optional().or(z.literal('')).or(z.undefined()),
    tags: z.string().optional(),
    stack: z.string().optional(),
    isDisabled: z.boolean().default(false),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectEditSchema = z.object({
    name: z.string().min(1, 'Nom requis'),
    description: z.string().min(1, 'Description requise'),
    year: z.string().min(4, 'Année requise'),
    slug: slugField,
    urlWebsite: z.string().url('URL invalide').optional().or(z.literal('')),
    urlRepository: z.string().url('URL invalide').optional().or(z.literal('')),
    tags: z.string().optional(),
    stack: z.string().optional(),
    isDisabled: z.boolean(),
    metaTitle: z.string().max(60).optional().nullable(),
    metaDescription: z.string().max(160).optional().nullable(),
})

export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type ProjectEditInput = z.infer<typeof projectEditSchema>