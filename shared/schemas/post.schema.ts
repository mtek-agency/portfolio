import * as z from 'zod'

export const postCreateSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug invalide (lettres minuscules, chiffres et tirets uniquement)'),
})

export const postUpdateSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Slug invalide'),
  excerpt: z.string().max(500).optional().nullable(),
  content: z.string(),
  coverImage: z.string().optional().nullable(),
  tags: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
  isFeatured: z.boolean(),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
})

export type PostCreateInput = z.infer<typeof postCreateSchema>
export type PostUpdateInput = z.infer<typeof postUpdateSchema>
